const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database initialization...');

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@neudev.com' },
    update: {},
    create: {
      email: 'admin@neudev.com',
      name: 'Admin User',
      password: 'adminpassword', // In production, hash this!
      isAdmin: true,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'client@neudev.com' },
    update: {},
    create: {
      email: 'client@neudev.com',
      name: 'Client User',
      password: 'clientpassword', // In production, hash this!
      isAdmin: false,
    },
  });

  // Create projects for each user
  const adminProject = await prisma.project.upsert({
    where: { id: 'admin-project-1' },
    update: {},
    create: {
      id: 'admin-project-1',
      title: 'Admin Project',
      description: 'A project managed by the admin.',
      userId: admin.id,
    },
  });

  const clientProject = await prisma.project.upsert({
    where: { id: 'client-project-1' },
    update: {},
    create: {
      id: 'client-project-1',
      title: 'Client Project',
      description: 'A project managed by the client.',
      userId: client.id,
    },
  });

  // Add activities to projects
  await prisma.activity.createMany({
    data: [
      {
        id: 'admin-activity-1',
        type: 'CONSULTATION',
        description: 'Admin consultation activity',
        status: 'DONE_PAID',
        hoursWorked: 2,
        startTime: new Date('2024-07-01T10:00:00Z'),
        endTime: new Date('2024-07-01T12:00:00Z'),
        hourRate: 8000,
        totalCost: 16000,
        projectId: adminProject.id,
      },
      {
        id: 'client-activity-1',
        type: 'TASK',
        description: 'Client task activity',
        status: 'UNDER_DEVELOPMENT',
        hoursWorked: 3,
        startTime: new Date('2024-07-02T09:00:00Z'),
        endTime: new Date('2024-07-02T12:00:00Z'),
        hourRate: 8000,
        totalCost: 24000,
        projectId: clientProject.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database initialized with admin and client users, projects, and activities.');
}

main()
  .catch((e) => {
    console.error('❌ Error during database initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 