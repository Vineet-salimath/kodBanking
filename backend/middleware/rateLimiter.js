const rateLimit = require('express-rate-limit');

/**
 * Login rate limiter: 10 attempts per 15 minutes per IP.
 * Returns JSON instead of HTML on block.
 */
const loginLimiter = rateLimit({
  windowMs:         15 * 60 * 1000,   // 15 minutes
  max:              10,
  standardHeaders:  true,
  legacyHeaders:    false,
  skipSuccessfulRequests: true,        // don't count successful logins
  handler: (req, res) => {
    const retryAfter = Math.ceil(req.rateLimit.resetTime
      ? (req.rateLimit.resetTime - Date.now()) / 1000
      : 900);
    res.status(429).json({
      success: false,
      message: `Too many login attempts. Try again in ${retryAfter} seconds.`,
    });
  },
});

/**
 * General API limiter: 120 requests per minute.
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (req, res) => {
    res.status(429).json({ success: false, message: 'Rate limit exceeded. Slow down.' });
  },
});

module.exports = { loginLimiter, apiLimiter };
