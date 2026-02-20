const jwt    = require('jsonwebtoken');
const { pool } = require('../config/db');
const { COOKIE_NAME } = require('../controllers/authController');

/**
 * Middleware: Extract JWT from cookie, verify, validate against DB.
 * Attaches decoded payload to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    // Accept Bearer token from Authorization header (cross-origin) OR HTTP-only cookie
    const authHeader = req.headers.authorization || '';
    const token = (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null)
                || req.cookies?.[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
        code: 'NO_TOKEN',
      });
    }

    // 1. Verify JWT signature & expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch (jwtErr) {
      const code = jwtErr.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN';
      const msg  = jwtErr.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid token. Please log in again.';
      return res.status(401).json({ success: false, message: msg, code });
    }

    // 2. Verify token exists in DB and is not expired
    const [rows] = await pool.execute(
      `SELECT tid FROM UserToken
       WHERE uid = ? AND token = ? AND expiry > NOW()
       LIMIT 1`,
      [decoded.uid, token]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Session invalid or revoked. Please log in again.',
        code: 'TOKEN_REVOKED',
      });
    }

    req.user = { uid: decoded.uid, username: decoded.sub, role: decoded.role };
    next();
  } catch (err) {
    console.error('[authenticate]', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { authenticate };
