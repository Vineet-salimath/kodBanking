const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');
const { COOKIE_NAME } = require('../controllers/loginController');

/**
 * Middleware: Authenticate requests via JWT cookie
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    }

    // Verify JWT signature & expiry
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ success: false, message: 'Invalid token.', code: 'INVALID_TOKEN' });
    }

    // Verify token exists in DB (not revoked)
    const storedToken = await prisma.userToken.findFirst({
      where: {
        token,
        user_id: decoded.userId,
        expires_at: { gte: new Date() },
      },
    });

    if (!storedToken) {
      return res.status(401).json({ success: false, message: 'Session invalid or revoked. Please log in again.', code: 'TOKEN_REVOKED' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate };
