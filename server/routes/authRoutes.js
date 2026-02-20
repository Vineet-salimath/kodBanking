const express = require('express');
const router = express.Router();

const { register, registerValidation } = require('../controllers/registerController');
const { login, loginValidation, logout } = require('../controllers/loginController');
const { loginRateLimit } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginRateLimit, loginValidation, login);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/me  – verify session
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
