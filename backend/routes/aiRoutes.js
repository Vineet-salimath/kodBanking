const express      = require('express');
const router       = express.Router();
const { chat }     = require('../controllers/aiController');
const { authenticate }  = require('../middleware/authMiddleware');
const { apiLimiter }    = require('../middleware/rateLimiter');

// POST /api/ai/chat  (protected – must be logged in)
router.post('/chat', apiLimiter, authenticate, chat);

module.exports = router;
