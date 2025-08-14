#!/bin/bash

echo "🔄 Running delivery schedules migration..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Run the migration
echo "📊 Running Prisma migration for delivery schedules..."
docker-compose exec backend npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo "✅ Delivery schedules migration completed successfully!"
    echo "📋 New table 'delivery_schedules' has been created with the following structure:"
    echo "   - id (Primary Key)"
    echo "   - orderId (Foreign Key to orders)"
    echo "   - deliveryDate"
    echo "   - assignedDriver"
    echo "   - status (SCHEDULED, IN_PROGRESS, DELIVERED, MISSED, CANCELLED)"
    echo "   - notes"
    echo "   - createdAt, updatedAt"
else
    echo "❌ Migration failed. Please check the logs above."
    exit 1
fi

echo "🎉 Orders module with delivery scheduling is now ready!"
