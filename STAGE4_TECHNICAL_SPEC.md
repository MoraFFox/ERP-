# Stage 4: Analytics & Profitability Dashboard - Technical Specification

## Overview

Stage 4 will transform the ERP system into a data-driven platform with comprehensive analytics, real-time profitability tracking, and predictive insights for business optimization.

## Core Features

### 4.1 Revenue Analytics Dashboard
- Real-time revenue tracking
- Monthly/quarterly/yearly comparisons
- Revenue by client, product, and category
- Profit margin analysis

### 4.2 Profitability Analysis
- Client profitability scoring
- Product margin analysis
- Cost center tracking
- ROI calculations

### 4.3 Predictive Analytics
- Sales forecasting
- Inventory optimization
- Client churn prediction
- Maintenance cost prediction

### 4.4 Custom Reporting Engine
- Drag-and-drop report builder
- Scheduled report generation
- Export capabilities (PDF, Excel, CSV)
- Email report distribution

## Technical Architecture

### 4.1 Analytics Data Layer

```typescript
// New analytics models
interface AnalyticsMetrics {
  revenue: {
    total: number;
    growth: number;
    forecast: number[];
  };
  profitability: {
    grossMargin: number;
    netMargin: number;
    byClient: ClientProfitability[];
    byProduct: ProductProfitability[];
  };
  operations: {
    orderVolume: number;
    deliveryEfficiency: number;
    maintenanceCosts: number;
  };
}

interface ClientProfitability {
  clientId: string;
  revenue: number;
  costs: number;
  margin: number;
  score: number; // 1-100
  trend: 'up' | 'down' | 'stable';
}
```

### 4.2 Real-time Data Pipeline

```typescript
// WebSocket implementation for real-time updates
class AnalyticsWebSocket {
  private io: Server;
  
  constructor() {
    this.io = new Server(server, {
      cors: { origin: process.env.FRONTEND_URL }
    });
  }
  
  broadcastMetricsUpdate(metrics: AnalyticsMetrics) {
    this.io.emit('metrics:update', metrics);
  }
}
```

### 4.3 Database Views for Analytics

```sql
-- Revenue analytics view
CREATE VIEW revenue_analytics AS
SELECT 
  DATE_TRUNC('month', order_date) as period,
  SUM(total_amount) as revenue,
  COUNT(*) as order_count,
  AVG(total_amount) as avg_order_value,
  SUM(total_amount - (
    SELECT SUM(oi.quantity * p.cost)
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = o.id
  )) as gross_profit
FROM orders o
WHERE status = 'DELIVERED'
GROUP BY DATE_TRUNC('month', order_date);

-- Client profitability view
CREATE VIEW client_profitability AS
SELECT 
  c.id,
  c.name,
  SUM(o.total_amount) as total_revenue,
  COUNT(o.id) as order_count,
  AVG(o.total_amount) as avg_order_value,
  SUM(COALESCE(mv.cost, 0)) as maintenance_costs,
  SUM(COALESCE(vc.distance_km, 0) * 0.5) as travel_costs -- $0.5 per km
FROM clients c
LEFT JOIN orders o ON c.id = o.client_id
LEFT JOIN maintenance_visits mv ON c.id = mv.client_id
LEFT JOIN visits_calls vc ON c.id = vc.client_id
GROUP BY c.id, c.name;
```

## Frontend Components

### 4.1 Dashboard Layout

```typescript
// Main analytics dashboard
const AnalyticsDashboard = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <RevenueChart />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <KPICards />
      </div>
      <div className="col-span-12 lg:col-span-6">
        <ClientProfitabilityTable />
      </div>
      <div className="col-span-12 lg:col-span-6">
        <ProductPerformanceChart />
      </div>
    </div>
  );
};
```

### 4.2 Chart Components

```typescript
// Revenue trend chart
const RevenueChart = () => {
  const { data, isLoading } = useAnalytics('revenue');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Line type="monotone" dataKey="revenue" stroke="#d97706" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
```

## API Endpoints for Stage 4

### 4.1 Analytics Endpoints

```typescript
// GET /api/v1/analytics/revenue
// GET /api/v1/analytics/profitability
// GET /api/v1/analytics/forecasts
// GET /api/v1/analytics/kpis
// POST /api/v1/analytics/reports/generate
```

### 4.2 Real-time Endpoints

```typescript
// WebSocket events
interface AnalyticsEvents {
  'metrics:update': AnalyticsMetrics;
  'alert:threshold': ThresholdAlert;
  'report:ready': ReportNotification;
}
```

## Performance Requirements

### 4.1 Response Time Targets
- Analytics queries: < 500ms
- Dashboard load: < 2 seconds
- Real-time updates: < 100ms latency
- Report generation: < 30 seconds

### 4.2 Scalability Targets
- Support 1000+ concurrent users
- Handle 10M+ records in analytics queries
- Process 1000+ real-time events per second
- Generate 100+ reports simultaneously

## Security Considerations

### 4.1 Data Access Control
- Role-based analytics access
- Client data isolation
- Audit logging for all analytics queries
- Secure report sharing

### 4.2 Performance Security
- Query timeout limits
- Resource usage monitoring
- Rate limiting for analytics APIs
- Caching security

## Testing Strategy

### 4.1 Analytics Testing
- Unit tests for calculation logic
- Integration tests for data aggregation
- Performance tests for large datasets
- Accuracy tests for financial calculations

### 4.2 Dashboard Testing
- Component testing for charts
- E2E testing for user workflows
- Visual regression testing
- Mobile responsiveness testing

---

## Implementation Phases

### Phase 1: Data Foundation (Week 1)
1. Create analytics database views
2. Implement data aggregation APIs
3. Add caching layer
4. Create basic analytics endpoints

### Phase 2: Dashboard Core (Week 2)
1. Build main dashboard layout
2. Implement KPI cards
3. Add revenue and profitability charts
4. Create client/product performance views

### Phase 3: Advanced Features (Week 3)
1. Add predictive analytics
2. Implement custom report builder
3. Add real-time updates
4. Create alert system

### Phase 4: Polish & Optimization (Week 4)
1. Performance optimization
2. Mobile responsiveness
3. Advanced filtering and drilling
4. Export and sharing features

---

*This specification provides the roadmap for Stage 4 implementation*