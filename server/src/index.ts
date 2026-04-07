<<<<<<< HEAD
import dotenv from 'dotenv';
// Load environment variables as early as possible
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import carRoutes from './routes/car.routes';
import sellerRoutes from './routes/seller.routes';
import offerRoutes from './routes/offer.routes';
import buyerRoutes from './routes/buyer.routes';
import messageRoutes from './routes/message.routes';
import walletRoutes from './routes/wallet.routes';
import inspectionRoutes from './routes/inspection.routes';
import savedCarRoutes from './routes/savedCar.routes';
import viewHistoryRoutes from './routes/viewHistory.routes';
import supportRoutes from './routes/support.routes';
import notificationRoutes from './routes/notification.routes';
import adminRoutes from './routes/admin.routes';

import { createServer } from 'http';
import { socketService } from './services/socket.service';

const app = express();
const httpServer = createServer(app);
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT) || 5000;

// Validate critical environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(', ')}`);
  console.log('Available environment variables:', Object.keys(process.env).filter(k => !k.includes('PASS') && !k.includes('SECRET') && !k.includes('URL')));
  process.exit(1);
}

console.log('Environment variables validated.');

// Initialize Socket.io
socketService.init(httpServer);

// Middleware
const allowedOrigins = [
  'https://huceautos.com',
  'https://www.huceautos.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://huce-autos.up.railway.app' // Example Railway URL placeholder
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const regex = new RegExp('^' + allowedOrigin.replace(/\*/g, '.*') + '$');
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (!isAllowed && process.env.NODE_ENV !== 'production') {
      // In development, be more lenient if needed
      return callback(null, true);
    }

    if (!isAllowed) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
  }
} catch (err) {
  console.warn('Could not create uploads directory. This might be expected on some ephemeral filesystems.', err);
}

app.use('/uploads', cors(), express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/saved-cars', savedCarRoutes);
app.use('/api/view-history', viewHistoryRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Huce Autos API', status: 'Running' });
});

// Health Check
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development'
    });
  } catch (error: any) {
    console.error('Health check failed:', error);
    res.status(503).json({ 
      status: 'Error', 
      database: 'Disconnected', 
      error: error.message,
      suggestion: 'Check if DATABASE_URL is correctly set and database is reachable.'
    });
  }
});

// Start Server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT} (bound to 0.0.0.0)`);
});

// Handle shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
=======
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
// Priority:
// 1. server/.env (if exists)
// 2. root/.env (if exists)
const serverEnvPath = path.resolve(__dirname, '../.env');
const rootEnvPath = path.resolve(__dirname, '../../.env');

dotenv.config({ path: serverEnvPath });
dotenv.config({ path: rootEnvPath });

import chatRoutes from './routes/chat';
import sessionRoutes from './routes/sessions';
import usageRoutes from './routes/usage';
import sharedRoutes from './routes/shared';
import authRoutes from './routes/auth';
import transcribeRoutes from './routes/transcribe';
import documentRoutes from './routes/documents';
import planRoutes from './routes/plans';
import subscriptionRoutes from './routes/subscriptions';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import toolsRoutes from './routes/tools';
import notificationRoutes from './routes/notifications';
import draftingRoutes from './routes/drafting';
import artifactRoutes from './routes/artifacts';

const app = express();
const port = process.env.PORT || 3000;

const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Always allow localhost in all environments for easier development/testing
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }

    if (corsOrigins.indexOf(origin) !== -1 || corsOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // TEMPORARILY ALLOW ALL FOR DEBUGGING
    }
  },
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/shared', sharedRoutes);
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/drafting', draftingRoutes);
app.use('/api/artifacts', artifactRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend build (dist) for non-API routes
const distPath = path.resolve(__dirname, '../../dist');


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origins: ${process.env.CORS_ORIGINS}`);
>>>>>>> c0d2170c979d123d4ebc2bcf6dc243b6f785be73
});
