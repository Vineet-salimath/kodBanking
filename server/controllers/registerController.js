const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../utils/prismaClient');

const SALT_ROUNDS = 12;

/**
 * Validation rules for registration
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9+\-\s]{7,20}$/).withMessage('Invalid phone number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and a number'),
];

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;

    // Check uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        phone,
        role: 'customer',
        password_hash,
        balance: 100000,
      },
      select: { id: true, name: true, email: true, phone: true, role: true, balance: true, created_at: true },
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Please log in.',
      user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, registerValidation };
