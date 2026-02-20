const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/db');

const SALT_ROUNDS = 10;
const COOKIE_NAME = 'kbtoken';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function safeErr(res, status, message) {
  return res.status(status).json({ success: false, message });
}

// ─── Validation chains ────────────────────────────────────────────────────────
const registerRules = [
  body('username')
    .trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 80 }).withMessage('Username must be 3–80 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username may only contain letters, numbers and underscores'),
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
    .withMessage('Password must contain an uppercase letter, lowercase letter and a digit'),
  body('phone')
    .trim().notEmpty().withMessage('Phone is required')
    .matches(/^[0-9+\-\s]{7,25}$/).withMessage('Invalid phone number'),
  body('role')
    .optional()
    .equals('customer').withMessage('Only "customer" role is allowed during public registration'),
];

const loginRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// ─── Register ─────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array().map(e => e.msg) });
  }

  const { username, email, password, phone, role = 'customer' } = req.body;

  try {
    // Check uniqueness
    const [rows] = await pool.execute(
      'SELECT uid FROM kodusar WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );
    if (rows.length > 0) {
      return safeErr(res, 409, 'Username or email is already registered');
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    await pool.execute(
      `INSERT INTO kodusar (username, email, password, phone, role, balance)
       VALUES (?, ?, ?, ?, ?, 10000.00)`,
      [username, email, hash, phone, role]
    );

    return res.status(201).json({ success: true, message: 'Account created. Please log in.' });
  } catch (err) {
    console.error('[register]', err.message);
    return safeErr(res, 500, 'Internal server error');
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array().map(e => e.msg) });
  }

  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT uid, username, password, role FROM kodusar WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return safeErr(res, 401, 'Invalid username or password');
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return safeErr(res, 401, 'Invalid username or password');
    }

    // Generate JWT
    const expirySeconds = parseInt(process.env.JWT_EXPIRY, 10) || 3600;
    const token = jwt.sign(
      { sub: user.username, role: user.role, uid: user.uid },
      process.env.JWT_SECRET,
      { expiresIn: expirySeconds, algorithm: 'HS256' }
    );

    const expiryDate = new Date(Date.now() + expirySeconds * 1000);

    // Revoke existing tokens for this user (single-session)
    await pool.execute('DELETE FROM UserToken WHERE uid = ?', [user.uid]);

    // Store new token
    await pool.execute(
      'INSERT INTO UserToken (uid, token, expiry) VALUES (?, ?, ?)',
      [user.uid, token, expiryDate]
    );

    // Set HTTP-only cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure:   isProd,
      sameSite: 'Strict',
      maxAge:   expirySeconds * 1000,
      path:     '/',
    });

    return res.json({
      success: true,
      message: 'Login successful',
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('[login]', err.message);
    return safeErr(res, 500, 'Internal server error');
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (token && req.user?.uid) {
      await pool.execute('DELETE FROM UserToken WHERE uid = ? AND token = ?', [req.user.uid, token]);
    }
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('[logout]', err.message);
    return safeErr(res, 500, 'Internal server error');
  }
};

module.exports = { register, login, logout, registerRules, loginRules, COOKIE_NAME };
