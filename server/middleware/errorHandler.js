/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  // Prisma-specific errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'A record with this information already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Record not found.',
    });
  }

  // JWT errors (should be handled in auth middleware, but catch any missed)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = process.env.NODE_ENV === 'production'
    ? (statusCode < 500 ? err.message : 'Internal server error')
    : err.message;

  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({ success: false, message });
};

/**
 * 404 handler – must be placed after all routes
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
};

module.exports = { errorHandler, notFoundHandler };
