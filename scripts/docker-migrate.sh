#!/bin/bash

# Database Migration Script for Docker
set -e

echo "🔄 Running database migrations in Docker..."

# Check if the API container is running
if ! docker ps | grep -q "erp-api"; then
    echo "❌ API container is not running. Please start the application first."
    exit 1
fi

# Run Prisma migrations
echo "📊 Running Prisma migrations..."
docker exec erp-api npx prisma migrate deploy

echo "✅ Database migrations completed successfully!"
