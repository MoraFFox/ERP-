# AI-Powered ERP System

A comprehensive Enterprise Resource Planning system built with Next.js for managing clients, products, orders, deliveries, maintenance, and business operations.

## System Overview

The ERP system provides complete business management functionality including:

- **Client Management**: Business details, contact information, and contract generation
- **Product Catalog**: Inventory tracking, pricing, and quality ratings
- **Order Processing**: Daily orders with delivery scheduling and status tracking
- **Delivery Management**: Automated scheduling with route optimization
- **Maintenance Scheduling**: Location-based visits with technician routing
- **Visit & Call Logging**: Client interaction tracking with distance calculations
- **Unified Dashboard**: Real-time analytics and operational visibility

## Technology Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **UI Components**: Custom component library with professional design
- **State Management**: React hooks and context
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Maps**: Interactive mapping for route optimization
- **Calendar**: Unified scheduling interface

## Features

### Stage 1: Core Foundation ✅
- Database schema and architecture
- Authentication system with JWT
- Client and product management APIs
- Docker configuration and deployment

### Stage 2: Frontend Application ✅
- React frontend with TypeScript
- Authentication pages and protected routes
- Client entry forms with file uploads
- Product catalog with filtering and search
- Daily order forms with multi-select

### Stage 3: Advanced Operations ✅
- Delivery scheduling with auto-generation
- Maintenance visit planning with route optimization
- Visit and call logging with distance tracking
- Unified calendar and map integration
- Comprehensive dashboard with real-time metrics

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## Demo Credentials

Use these credentials to explore the system:
- **Email**: test@example.com
- **Password**: password123

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout
│   ├── deliveries/        # Delivery management
│   ├── maintenance/       # Maintenance scheduling
│   └── schedule/          # Unified calendar
├── components/            # Reusable components
│   ├── auth/             # Authentication forms
│   ├── dashboard/        # Dashboard components
│   ├── clients/          # Client management
│   ├── products/         # Product catalog
│   ├── orders/           # Order processing
│   ├── delivery/         # Delivery scheduling
│   ├── maintenance/      # Maintenance planning
│   ├── visits/           # Visit logging
│   └── ui/               # Base UI components
└── backend/              # Express.js API (separate deployment)
\`\`\`

## Design System

The application uses a professional design system with:
- **Colors**: Amber/golden primary palette with neutral grays
- **Typography**: Playfair Display (headings) + Source Sans Pro (body)
- **Layout**: Mobile-first responsive design
- **Components**: Consistent spacing and interaction patterns

## Development

The system is built with modern development practices including TypeScript for type safety, comprehensive form validation, error boundaries for robust error handling, and responsive design for all screen sizes.
