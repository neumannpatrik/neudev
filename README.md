# neudev
# Project Overview

This project is a portfolio + project management app built with NextJS, Express, Prisma, and PostgreSQL.

## Design Guidelines
- Use Tailwind CSS for styling
- Keep UI minimal and clean
- Use these color palettes in this project:
    - #222831.
    - #393E46
    - #00ADB5
    - #EEEEEE
- Responsive design for mobile and desktop
- API responses follow REST best practices

## Tech Stack
- Node.js, Express, Prisma ORM, PostgreSQL
- Deployment on Railway

## Project Structure
```
neudev/
├── frontend/          # NextJS application
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── public/       # Static assets
├── backend/          # Express API server
│   ├── src/          # Source code
│   │   ├── routes/   # API routes
│   │   └── config/   # Configuration files
│   └── prisma/       # Database schema and migrations
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neudev
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   - Create a PostgreSQL database
   - Copy `backend/env.example` to `backend/.env`
   - Update the `DATABASE_URL` in `backend/.env` with your database credentials

4. **Initialize the database**
   ```bash
   cd backend
   npm run db:generate
   npm run db:push
   ```

5. **Start the development servers**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Database Setup

### Quick Setup with Docker (Recommended)
```bash
./setup-database.sh
```

This script will:
- Start PostgreSQL database in Docker
- Set up the database schema
- Initialize with sample data
- Provide access to pgAdmin for database management

### Manual Setup Options

#### Option 1: Docker (Manual)
```bash
# Start database
docker-compose up -d postgres

# Set up schema and sample data
cd backend
npm run db:generate
npm run db:push
npm run db:init
```

#### Option 2: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE neudev_db;
   ```
3. Update the `DATABASE_URL` in `backend/.env`:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/neudev_db"
   ```

#### Option 3: Railway (Recommended for deployment)
1. Create a Railway account
2. Create a new PostgreSQL database
3. Copy the connection string to `backend/.env`

#### Option 4: Supabase (Free tier available)
1. Create a Supabase account
2. Create a new project
3. Use the connection string from the database settings

### Database Schema

#### Projects
- `id`: Unique identifier
- `title`: Project title
- `description`: Project description
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

#### Activities
- `id`: Unique identifier
- `type`: Activity type (CONSULTATION or TASK)
- `description`: Activity description
- `status`: Activity status (NEW, UNDER_DEVELOPMENT, DONE_UNPAID, DONE_PAID)
- `hoursWorked`: Number of hours worked
- `startTime`: Activity start timestamp
- `endTime`: Activity end timestamp
- `hourRate`: Hourly rate in HUF (default: 8000)
- `totalCost`: Calculated total cost (hoursWorked × hourRate)
- `projectId`: Reference to the parent project

### Database Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Initialize with sample data
npm run db:init
```

## Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run install:all` - Install dependencies for all workspaces

### Frontend (NextJS)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend (Express)
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- More endpoints will be added as the project grows

## Development

The project uses a monorepo structure with npm workspaces. The frontend and backend are separate applications that can be developed independently or together.

### Frontend Development
The frontend is built with NextJS 14 using the App Router, TypeScript, and Tailwind CSS. The design follows the specified color palette and focuses on minimal, clean UI.

### Backend Development
The backend is an Express.js API with Prisma ORM for database operations. It follows REST best practices and includes proper error handling and middleware.

## 🚀 Production Deployment with Docker Compose

1. **Set up environment variables:**
   - Copy `backend/.env` and `frontend/.env` and fill in secrets (DB password, JWT secret, etc).
2. **Build and start all services:**
   ```sh
   docker-compose up -d --build
   ```
3. **Access your app:**
   - Frontend: http://your-server-ip:3000
   - Backend API: http://your-server-ip:3001
   - pgAdmin: http://your-server-ip:5050
4. **(Recommended) Set up a reverse proxy (Nginx, Caddy) for HTTPS and domain routing.**
5. **Monitor logs:**
   ```sh
   docker-compose logs -f
   ```
6. **Update:**
   ```sh
   git pull && docker-compose up -d --build
   ```

**Security:** Never commit real secrets to git. Use `.env` files for sensitive data.