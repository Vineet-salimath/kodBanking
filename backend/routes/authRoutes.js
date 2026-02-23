const express    = require('express');
const router     = express.Router();
const { register, login, logout, me, registerRules, loginRules } = require('../controllers/authController');
const { authenticate }  = require('../middleware/authMiddleware');
const { loginLimiter }  = require('../middleware/rateLimiter');

// POST /api/register
router.post('/register', registerRules, register);

// POST /api/login   (rate-limited)
router.post('/login', loginLimiter, loginRules, login);

// POST /api/auth/logout  (protected)
router.post('/logout', authenticate, logout);

// GET  /api/auth/me  (protected) – verify session + return user info
router.get('/me', authenticate, me);

module.exports = router;
