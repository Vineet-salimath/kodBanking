const express    = require('express');
const router     = express.Router();
const { register, login, logout, registerRules, loginRules } = require('../controllers/authController');
const { authenticate }  = require('../middleware/authMiddleware');
const { loginLimiter }  = require('../middleware/rateLimiter');

// POST /api/register
router.post('/register', registerRules, register);

// POST /api/login   (rate-limited)
router.post('/login', loginLimiter, loginRules, login);

// POST /api/logout  (protected)
router.post('/logout', authenticate, logout);

module.exports = router;
