#!/bin/bash

# Database Migration Script for Docker
set -e

echo "🔄 Running database migrations in Docker..."

# Function to wait for database to be ready
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec erp-postgres pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-erp_system} > /dev/null 2>&1; then
            echo "✅ Database is ready!"
            return 0
        fi
        
        echo "🔄 Attempt $attempt/$max_attempts: Database not ready yet..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ Database failed to become ready after $max_attempts attempts"
    return 1
}

# Check if Docker Compose services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Docker Compose services are not running. Starting them..."
    docker-compose up -d
    sleep 10
fi

# Wait for database to be ready
wait_for_db

echo "📊 Running Prisma migrations..."
NEON_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_system?schema=public" \
npx prisma migrate deploy

echo "🔧 Ensuring Prisma client is generated..."
NEON_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_system?schema=public" \
npx prisma generate

echo "✅ Database migrations completed successfully!"

# Optional: Run seed data
read -p "🌱 Do you want to run seed data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Running seed data..."
    NEON_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_system?schema=public" \
    npm run db:seed
    echo "✅ Seed data completed!"
fi
#!/bin/bash

# Database Migration Script for Docker
set -e

echo "🔄 Running database migrations in Docker..."

# Function to wait for database to be ready
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec erp-postgres pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-erp_system} > /dev/null 2>&1; then
            echo "✅ Database is ready!"
            return 0
        fi
        
        echo "🔄 Attempt $attempt/$max_attempts: Database not ready yet..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ Database failed to become ready after $max_attempts attempts"
    return 1
}

# Check if Docker Compose services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Docker Compose services are not running. Starting them..."
    docker-compose up -d
    sleep 10
fi

# Wait for database to be ready
wait_for_db

echo "📊 Running Prisma migrations..."
NEON_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_system?schema=public" \
npx prisma migrate deploy

echo "🔧 Ensuring Prisma client is generated..."
NEON_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_system?schema=public" \
npx prisma generate

echo "✅ Database migrations completed successfully!"

# Optional: Run seed data
read -p "🌱 Do you want to run seed data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Running seed data..."
    NEON_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp_system?schema=public" \
    npm run db:seed
    echo "✅ Seed data completed!"
fi
