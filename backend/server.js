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
    // allow same-origin requests (no Origin header) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
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
  try {
    await connect();          // verify MySQL reachability
    startCleanupJob();        // expired token GC every 15 min

    app.listen(PORT, () => {
      console.log(`🚀  Kodbank API  →  http://localhost:${PORT}`);
      console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`    Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error('❌  Startup failed:', err.message, err.stack);
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
