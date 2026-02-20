const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');

const COOKIE_NAME = 'kodbank_token';
const TOKEN_EXPIRY_SECONDS = 3600; // 1 hour

/**
 * Validation rules for login
 */
const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { sub: user.email, role: user.role, userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY_SECONDS, algorithm: 'HS256' }
    );

    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_SECONDS * 1000);

    // Store token in DB
    await prisma.userToken.create({
      data: {
        user_id: user.id,
        token,
        expires_at: expiresAt,
      },
    });

    // Set HTTP-only cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: TOKEN_EXPIRY_SECONDS * 1000,
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (token) {
      // Invalidate token in DB
      await prisma.userToken.deleteMany({ where: { token } });
    }

    res.clearCookie(COOKIE_NAME, { path: '/' });
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, loginValidation, logout, COOKIE_NAME };
