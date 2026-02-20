const express            = require('express');
const router             = express.Router();
const { getBalance }     = require('../controllers/balanceController');
const { getTransactions, transfer, transferRules, getProfile } = require('../controllers/accountController');
const { authenticate }   = require('../middleware/authMiddleware');
const { apiLimiter }     = require('../middleware/rateLimiter');

// GET  /api/balance
router.get('/balance', apiLimiter, authenticate, getBalance);

// GET  /api/profile
router.get('/profile', apiLimiter, authenticate, getProfile);

// GET  /api/transactions
router.get('/transactions', apiLimiter, authenticate, getTransactions);

// POST /api/transfer
router.post('/transfer', apiLimiter, authenticate, transferRules, transfer);

module.exports = router;
