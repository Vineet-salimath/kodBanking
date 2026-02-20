const express = require('express');
const router = express.Router();

const { getBalance } = require('../controllers/balanceController');
const { authenticate } = require('../middleware/auth');
const { apiRateLimit } = require('../middleware/rateLimiter');

// GET /api/account/balance
router.get('/balance', apiRateLimit, authenticate, getBalance);

module.exports = router;
