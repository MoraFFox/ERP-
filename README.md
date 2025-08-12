# AI-Powered ERP System

A comprehensive Enterprise Resource Planning system with AI capabilities for managing clients, sales, maintenance, and business analytics.

## Architecture Overview

The system follows a microservices architecture with the following components:

### Core Services
- **API Gateway**: Main Express.js server handling all HTTP requests
- **Authentication Service**: JWT-based auth with refresh tokens
- **Database Layer**: PostgreSQL with Prisma ORM
- **AI Microservices**: Python FastAPI services for ML models

### System Architecture

\`\`\`mermaid
graph TB
    Client[Frontend React App] --> Gateway[API Gateway - Express.js]
    Gateway --> Auth[Auth Service]
    Gateway --> ClientAPI[Client Management API]
    Gateway --> ProductAPI[Product Management API]
    Gateway --> OrderAPI[Order Management API]
    Gateway --> MaintenanceAPI[Maintenance API]
    Gateway --> AnalyticsAPI[Analytics API]
    
    Auth --> DB[(PostgreSQL Database)]
    ClientAPI --> DB
    ProductAPI --> DB
    OrderAPI --> DB
    MaintenanceAPI --> DB
    AnalyticsAPI --> DB
    
    Gateway --> AIGateway[AI Services Gateway]
    AIGateway --> Forecasting[Forecasting Service - FastAPI]
    AIGateway --> ChurnDetection[Churn Detection - FastAPI]
    AIGateway --> OCR[OCR Service - FastAPI]
    AIGateway --> Sentiment[Sentiment Analysis - FastAPI]
    
    DB --> Prisma[Prisma ORM]
\`\`\`

### Technology Stack
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Refresh Tokens + bcrypt
- **Containerization**: Docker + Docker Compose
- **AI Services**: Python + FastAPI
- **Frontend**: React (Stage 2)

## Stage 1 Implementation

This stage includes:
- ✅ Architecture design and documentation
- ✅ Database schema with Prisma
- ✅ Authentication system (JWT + refresh tokens)
- ✅ Core CRUD endpoints (clients, products)
- ✅ Docker configuration
- ✅ Seed data and health checks
- ✅ API documentation
- ✅ Basic testing setup

## Quick Start

\`\`\`bash
# Clone and setup
git clone <repo-url>
cd erp-system

# Start with Docker Compose
docker-compose up -d

# Run migrations and seed data
npm run db:migrate
npm run db:seed

# Test the API
curl http://localhost:3000/api/health
\`\`\`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Core Resources
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client details
- `POST /api/products` - Create product
- `GET /api/products` - List products

See API documentation for complete endpoint details.
