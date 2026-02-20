require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const prisma = require('./utils/prismaClient');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Middleware ────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Remove server fingerprint
app.disable('x-powered-by');

// Security headers
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

// ─── Error Handlers ──────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅  Database connected');

    app.listen(PORT, () => {
      console.log(`🚀  Kodbank API running on http://localhost:${PORT}`);
      console.log(`    Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌  Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑  Shutting down gracefully…');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

start();
