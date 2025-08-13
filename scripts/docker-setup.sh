#!/bin/bash

# ERP System Docker Setup Script
# This script helps set up the Docker environment for the ERP system

set -e

echo "🚀 Setting up ERP System Docker Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p data/postgres
mkdir -p data/redis

# Copy environment files if they don't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update the .env file with your configuration before running the application."
fi

if [ ! -f .env.docker ]; then
    echo "📄 Creating .env.docker file..."
    cp .env.docker .env.docker.example
    echo "⚠️  Please update the .env.docker file with your production configuration."
fi

# Make scripts executable
chmod +x scripts/*.sh

echo "🔄 Stopping existing containers..."
docker-compose down --volumes --remove-orphans

echo "🔨 Building containers with OpenSSL compatibility fixes..."
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 15

echo "🔍 Checking service health..."
if docker-compose ps | grep -q "Up (healthy)"; then
    echo "✅ Services are running and healthy!"
else
    echo "⚠️  Services are starting up. Check logs with: docker-compose logs"
fi

echo "✅ Docker environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files with your configuration"
echo "2. Run 'bash scripts/docker-migrate.sh' to run database migrations"
echo "3. Run 'npm run docker:seed' to seed the database"
echo "4. Access the API at http://localhost:3000/api/health"
echo ""
echo "Useful commands:"
echo "- View logs: docker-compose logs -f"
echo "- Stop services: docker-compose down"
echo "- Restart services: docker-compose restart"
