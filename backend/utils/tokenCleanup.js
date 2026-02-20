const { pool } = require('../config/db');

/**
 * Delete expired tokens from UserToken table.
 * Runs automatically on an interval to keep the table clean.
 */
async function cleanExpiredTokens() {
  try {
    const [result] = await pool.execute(
      'DELETE FROM UserToken WHERE expiry <= NOW()'
    );
    if (result.affectedRows > 0) {
      console.log(`[TokenCleanup] Removed ${result.affectedRows} expired token(s)`);
    }
  } catch (err) {
    console.error('[TokenCleanup] Error:', err.message);
  }
}

/**
 * Start the cleanup job on the given interval (default: every 15 minutes).
 * @param {number} intervalMs
 */
function startCleanupJob(intervalMs = 15 * 60 * 1000) {
  // Run once at startup
  cleanExpiredTokens();
  // Then repeat
  setInterval(cleanExpiredTokens, intervalMs);
  console.log(`✅  Token cleanup job started (every ${intervalMs / 60000} min)`);
}

module.exports = { cleanExpiredTokens, startCleanupJob };
