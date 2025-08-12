#!/bin/bash

# Database Seeding Script for Docker
set -e

echo "🌱 Seeding database in Docker..."

# Check if the API container is running
if ! docker ps | grep -q "erp-api"; then
    echo "❌ API container is not running. Please start the application first."
    exit 1
fi

# Run database seeding
echo "📊 Running database seed..."
docker exec erp-api npm run db:seed

echo "✅ Database seeding completed successfully!"
