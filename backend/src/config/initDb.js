const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database initialization...');

  // Create sample projects
  const project1 = await prisma.project.upsert({
    where: { id: 'sample-project-1' },
    update: {},
    create: {
      id: 'sample-project-1',
      title: 'E-commerce Website',
      description: 'A modern e-commerce platform for a local business',
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: 'sample-project-2' },
    update: {},
    create: {
      id: 'sample-project-2',
      title: 'Mobile App Development',
      description: 'Cross-platform mobile application for iOS and Android',
    },
  });

  // Create sample activities
  const activity1 = await prisma.activity.upsert({
    where: { id: 'sample-activity-1' },
    update: {},
    create: {
      id: 'sample-activity-1',
      type: 'CONSULTATION',
      description: 'Initial project consultation and requirements gathering',
      status: 'DONE_PAID',
      hoursWorked: 2.5,
      startTime: new Date('2024-01-15T09:00:00Z'),
      endTime: new Date('2024-01-15T11:30:00Z'),
      hourRate: 8000,
      totalCost: 20000, // 2.5 * 8000
      projectId: project1.id,
    },
  });

  const activity2 = await prisma.activity.upsert({
    where: { id: 'sample-activity-2' },
    update: {},
    create: {
      id: 'sample-activity-2',
      type: 'TASK',
      description: 'Database schema design and implementation',
      status: 'UNDER_DEVELOPMENT',
      hoursWorked: 4.0,
      startTime: new Date('2024-01-16T10:00:00Z'),
      endTime: new Date('2024-01-16T14:00:00Z'),
      hourRate: 8000,
      totalCost: 32000, // 4.0 * 8000
      projectId: project1.id,
    },
  });

  const activity3 = await prisma.activity.upsert({
    where: { id: 'sample-activity-3' },
    update: {},
    create: {
      id: 'sample-activity-3',
      type: 'CONSULTATION',
      description: 'Mobile app architecture planning',
      status: 'DONE_UNPAID',
      hoursWorked: 3.0,
      startTime: new Date('2024-01-17T13:00:00Z'),
      endTime: new Date('2024-01-17T16:00:00Z'),
      hourRate: 8000,
      totalCost: 24000, // 3.0 * 8000
      projectId: project2.id,
    },
  });

  console.log('✅ Database initialized with sample data:');
  console.log(`   - Created ${await prisma.project.count()} projects`);
  console.log(`   - Created ${await prisma.activity.count()} activities`);
}

main()
  .catch((e) => {
    console.error('❌ Error during database initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 