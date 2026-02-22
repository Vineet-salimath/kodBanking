require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

const { connect }        = require('./config/db');
const authRoutes         = require('./routes/authRoutes');
const balanceRoutes      = require('./routes/balanceRoutes');
const { startCleanupJob} = require('./utils/tokenCleanup');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Trusted origins ──────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.set('trust proxy', 1);   // trust Railway/Render reverse proxy

app.use(helmet());            // secure headers
app.use(cors({
  origin: (origin, cb) => {
    // allow same-origin (no Origin header), listed origins, and
    // 'null' origin sent by browsers for file:// pages in local dev
    const isDev = process.env.NODE_ENV !== 'production';
    if (!origin || allowedOrigins.includes(origin) || (isDev && origin === 'null')) {
      return cb(null, true);
    }
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Remove fingerprint header
app.disable('x-powered-by');

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'ok', environment: process.env.NODE_ENV, ts: new Date().toISOString() })
);

app.use('/api', authRoutes);
app.use('/api', balanceRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  if (isDev) console.error('[Unhandled]', err);
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : 'Internal server error',
  });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
(async () => {
  // ── Validate required env vars before touching the DB ──
  const REQUIRED = ['DB_HOST','DB_PORT','DB_USER','DB_PASSWORD','DB_NAME','JWT_SECRET','HF_TOKEN'];
  const missing  = REQUIRED.filter(k => !process.env[k]);
  if (missing.length) {
    console.error('❌  Missing environment variables:', missing.join(', '));
    console.error('    Set them in Railway → your service → Variables tab.');
    process.exit(1);
  }

  // Print non-sensitive config so Railway logs show what was picked up
  console.log('[Config] DB_HOST   :', process.env.DB_HOST);
  console.log('[Config] DB_PORT   :', process.env.DB_PORT);
  console.log('[Config] DB_NAME   :', process.env.DB_NAME);
  console.log('[Config] DB_USER   :', process.env.DB_USER);
  console.log('[Config] NODE_ENV  :', process.env.NODE_ENV);
  console.log('[Config] PORT      :', PORT);

  try {
    await connect();          // verify MySQL reachability
    startCleanupJob();        // expired token GC every 15 min

    const server = app.listen(PORT, () => {
      console.log(`🚀  Kodbank API  →  http://localhost:${PORT}`);
      console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`    Allowed origins: ${allowedOrigins.join(', ')}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌  Port ${PORT} is already in use. Kill the existing process and retry.`);
      } else {
        console.error('❌  Server error:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌  Startup failed:', err.message);
    console.error('    Check DB credentials, Aiven firewall, and SSL settings.');
    console.error(err.stack);
    process.exit(1);
  }
})();

// ─── Graceful shutdown ────────────────────────────────────────────────────────
const shutdown = (sig) => {
  console.log(`\n[${sig}] Shutting down gracefully…`);
  process.exit(0);
};
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
