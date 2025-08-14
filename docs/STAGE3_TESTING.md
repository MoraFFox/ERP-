# Stage 3 Testing Guide

## Overview
This document outlines the testing procedures for Stage 3 ERP system functionality including orders management, delivery scheduling, maintenance visits, and client interaction logging.

## Test Categories

### 1. Orders Module Testing
- **Order Creation**: Test order creation with automatic delivery scheduling
- **Status Updates**: Verify order status transitions (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
- **Order Items**: Test multiple items per order with quantity and pricing calculations
- **Validation**: Test input validation for required fields and business rules

### 2. Delivery Scheduling Testing
- **Auto-Generation**: Verify delivery schedules are created automatically when orders are placed
- **Date Calculation**: Test delivery date calculation based on client consumption patterns
- **Driver Assignment**: Test driver assignment and workload balancing
- **Rescheduling**: Test manual delivery date changes and notifications
- **Route Optimization**: Verify delivery route optimization algorithms

### 3. Maintenance Scheduling Testing
- **Visit Creation**: Test maintenance visit scheduling with location data
- **Auto-Generation**: Verify automatic maintenance scheduling based on client intervals
- **Route Optimization**: Test technician route optimization with location clustering
- **Status Tracking**: Test maintenance visit status updates and completion
- **Cost Tracking**: Verify maintenance cost calculation and reporting

### 4. Visits & Calls Logging Testing
- **Visit Logging**: Test client visit logging with distance tracking
- **Call Logging**: Test phone call and email interaction logging
- **History Retrieval**: Test visit/call history retrieval and filtering
- **Distance Calculation**: Verify distance calculation accuracy
- **Follow-up Scheduling**: Test follow-up appointment scheduling

### 5. Integration Testing
- **Order-to-Delivery Flow**: Test complete workflow from order creation to delivery completion
- **Maintenance Scheduling**: Test automatic maintenance visit generation for new clients
- **Calendar Integration**: Test unified calendar view with all scheduling data
- **Map Integration**: Test location-based features and route optimization
- **Dashboard Updates**: Verify dashboard metrics update with new data

## Running Tests

### Backend API Tests
\`\`\`bash
# Run all Stage 3 tests
npm test -- __tests__/stage3.test.ts

# Run specific test suites
npm test -- --grep "Orders Module"
npm test -- --grep "Delivery Scheduling"
npm test -- --grep "Maintenance Scheduling"
\`\`\`

### Frontend Component Tests
\`\`\`bash
# Test delivery components
npm test -- components/delivery/

# Test maintenance components  
npm test -- components/maintenance/

# Test scheduling components
npm test -- components/scheduling/
\`\`\`

### Integration Tests
\`\`\`bash
# Run full integration test suite
npm run test:integration

# Test database migrations
npm run test:migrations
\`\`\`

## Test Data Setup

### Sample Test Data
The test suite uses the following sample data:
- Test client: "Test Client" with email client@test.com
- Test products with various pricing and categories
- Sample orders with multiple items
- Delivery schedules with different statuses
- Maintenance visits with location data
- Visit/call logs with distance tracking

### Database Cleanup
Tests automatically clean up data after each test run to ensure isolation.

## Performance Testing

### Load Testing
- Test system performance with 100+ concurrent orders
- Verify delivery scheduling performance with large datasets
- Test route optimization with 50+ locations
- Measure response times for calendar views with extensive data

### Scalability Testing
- Test database performance with 10,000+ records
- Verify API response times under load
- Test frontend performance with large datasets
- Measure memory usage and optimization

## Acceptance Criteria

### Stage 3 Requirements Verification
- ✅ Orders module with status tracking and automatic delivery scheduling
- ✅ Delivery scheduling with route optimization and driver assignment
- ✅ Maintenance scheduling with location-based clustering
- ✅ Visits & calls logging with distance tracking
- ✅ Calendar integration showing all scheduling data
- ✅ Map integration with location visualization
- ✅ Dashboard updates with Stage 3 metrics

### Performance Benchmarks
- API response times < 200ms for standard operations
- Calendar views load < 1 second with 1000+ events
- Route optimization completes < 5 seconds for 20+ locations
- Database queries optimized with proper indexing

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure test database is running and accessible
2. **Authentication**: Verify test user credentials are correct
3. **Location Data**: Check that location coordinates are valid
4. **Date Handling**: Ensure proper timezone handling in tests
5. **Route Optimization**: Verify location clustering algorithms work correctly

### Debug Commands
\`\`\`bash
# Enable debug logging
DEBUG=* npm test

# Run tests with verbose output
npm test -- --verbose

# Check database state
npm run db:inspect
