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

echo "✅ Docker environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env files with your configuration"
echo "2. Run 'npm run docker:dev' for development"
echo "3. Run 'npm run docker:prod' for production"
echo "4. Run 'npm run docker:migrate' to run database migrations"
echo "5. Run 'npm run docker:seed' to seed the database"
