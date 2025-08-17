import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import maintenanceRoutes from './routes/maintenance';
import deliveryRoutes from './routes/deliveries';
import visitCallRoutes from './routes/visit-calls';
import errorHandler from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000')
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/maintenance', authenticateToken, maintenanceRoutes);
app.use('/api/deliveries', authenticateToken, deliveryRoutes);
app.use('/api/visit-calls', authenticateToken, visitCallRoutes);

// Health check endpoint
app.get('/api/health', (_, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle shutdown
process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
