const { RateLimiterMemory } = require('rate-limiter-flexible');

// Login rate limiter: max 10 attempts per 15 minutes per IP
const loginLimiter = new RateLimiterMemory({
  keyPrefix: 'login',
  points: 10,
  duration: 900, // 15 minutes
  blockDuration: 900,
});

// General API limiter: 100 requests per minute per IP
const apiLimiter = new RateLimiterMemory({
  keyPrefix: 'api',
  points: 100,
  duration: 60,
});

const rateLimitHandler = (limiter) => async (req, res, next) => {
  try {
    await limiter.consume(req.ip || 'unknown');
    next();
  } catch (rlRejected) {
    const secs = Math.ceil(rlRejected.msBeforeNext / 1000) || 60;
    res.set('Retry-After', String(secs));
    res.status(429).json({
      success: false,
      message: `Too many requests. Please try again in ${secs} seconds.`,
    });
  }
};

module.exports = {
  loginRateLimit: rateLimitHandler(loginLimiter),
  apiRateLimit: rateLimitHandler(apiLimiter),
};
