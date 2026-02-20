const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// ─── SSL configuration ────────────────────────────────────────────────────────
// Aiven requires SSL. If you have the CA cert file, drop it in config/ca.pem
// and set DB_SSL_CA=config/ca.pem in .env. Otherwise we use encrypted connection
// without certificate pinning (rejectUnauthorized:false).
function buildSslConfig() {
  const caPath = process.env.DB_SSL_CA;
  if (caPath) {
    const absPath = path.resolve(__dirname, '..', caPath);
    if (fs.existsSync(absPath)) {
      return { ca: fs.readFileSync(absPath) };
    }
    console.warn(`[DB] CA cert not found at ${absPath}. Falling back to rejectUnauthorized:false`);
  }
  return { rejectUnauthorized: false };
}

// ─── Connection pool ──────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10) || 25673,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:      buildSslConfig(),
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  enableKeepAlive:    true,
  keepAliveInitialDelay: 30000,
});

/**
 * Test the connection on startup.
 */
async function connect() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('✅  MySQL (Aiven) connected successfully');
}

module.exports = { pool, connect };
