#!/bin/bash

echo "🗄️  Setting up Neudev Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down -v

# Start the database
echo "🚀 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready
echo "🔍 Checking database connection..."
until docker exec neudev_postgres pg_isready -U neudev_user -d neudev_db; do
    echo "⏳ Database is not ready yet, waiting..."
    sleep 2
done

echo "✅ Database is ready!"

# Copy environment file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env"
else
    echo "✅ backend/.env already exists"
fi

# Install backend dependencies if not already installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install --legacy-peer-deps
    cd ..
else
    echo "✅ Backend dependencies already installed"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
cd backend
npm run db:generate

# Push schema to database
echo "📊 Pushing database schema..."
npm run db:push

# Initialize database with sample data
echo "🌱 Initializing database with sample data..."
npm run db:init

cd ..

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📊 Database Information:"
echo "   - Host: localhost"
echo "   - Port: 5432"
echo "   - Database: neudev_db"
echo "   - Username: neudev_user"
echo "   - Password: neudev_password"
echo ""
echo "🔧 Management Tools:"
echo "   - Prisma Studio: cd backend && npm run db:studio"
echo "   - pgAdmin: http://localhost:5050 (admin@neudev.com / admin123)"
echo ""
echo "📁 Database Schema:"
echo "   - Projects: Simple projects with title and description"
echo "   - Activities: Tasks and consultations with time tracking and costs"
echo "   - Activity Types: CONSULTATION, TASK"
echo "   - Activity Status: NEW, UNDER_DEVELOPMENT, DONE_UNPAID, DONE_PAID"
echo ""
echo "💰 Cost Calculation:"
echo "   - Default hourly rate: 8000 HUF"
echo "   - Total cost = hours worked × hourly rate"
echo ""
echo "Happy coding! 🚀" 