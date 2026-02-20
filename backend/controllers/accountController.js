const { body, validationResult } = require('express-validator');
const { pool } = require('../config/db');

// ─── GET /api/transactions ─────────────────────────────────────────────────
const getTransactions = async (req, res) => {
  try {
    const { uid } = req.user;
    const limit  = Math.min(parseInt(req.query.limit,  10) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0,  0);

    const [rows] = await pool.execute(
      `SELECT txid, type, amount, description, recipient, status, created_at
       FROM transactions
       WHERE uid = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [uid, limit, offset]
    );

    const [[{ total }]] = await pool.execute(
      'SELECT COUNT(*) AS total FROM transactions WHERE uid = ?',
      [uid]
    );

    return res.json({ success: true, data: { transactions: rows, total, limit, offset } });
  } catch (err) {
    console.error('[getTransactions]', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /api/transfer ────────────────────────────────────────────────────
const transferRules = [
  body('recipient').trim().notEmpty().withMessage('Recipient username is required'),
  body('amount')
    .isFloat({ min: 1, max: 1000000 })
    .withMessage('Amount must be between ₹1 and ₹10,00,000'),
  body('description').optional().trim().isLength({ max: 255 }),
];

const transfer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array().map(e => e.msg) });
  }

  const { uid, username } = req.user;
  const { recipient, amount, description = 'Transfer' } = req.body;
  const amt = parseFloat(amount);

  if (recipient === username) {
    return res.status(400).json({ success: false, message: 'You cannot transfer money to yourself' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Lock sender row
    const [[sender]] = await conn.execute(
      'SELECT uid, balance FROM kodusar WHERE uid = ? FOR UPDATE',
      [uid]
    );
    if (!sender) throw new Error('Sender not found');
    if (parseFloat(sender.balance) < amt) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Find recipient
    const [[rec]] = await conn.execute(
      'SELECT uid FROM kodusar WHERE username = ? LIMIT 1',
      [recipient]
    );
    if (!rec) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: `User "${recipient}" not found` });
    }

    // Debit sender
    await conn.execute('UPDATE kodusar SET balance = balance - ? WHERE uid = ?', [amt, uid]);
    // Credit recipient
    await conn.execute('UPDATE kodusar SET balance = balance + ? WHERE uid = ?', [amt, rec.uid]);

    // Record debit transaction
    await conn.execute(
      `INSERT INTO transactions (uid, type, amount, description, recipient, status)
       VALUES (?, 'debit', ?, ?, ?, 'completed')`,
      [uid, amt, description, recipient]
    );
    // Record credit transaction
    await conn.execute(
      `INSERT INTO transactions (uid, type, amount, description, recipient, status)
       VALUES (?, 'credit', ?, ?, ?, 'completed')`,
      [rec.uid, amt, `Received from ${username}`, username]
    );

    await conn.commit();

    // Return updated balance
    const [[{ balance }]] = await conn.execute('SELECT balance FROM kodusar WHERE uid = ?', [uid]);

    return res.json({
      success: true,
      message: `₹${amt.toLocaleString('en-IN')} transferred to ${recipient} successfully`,
      data: { newBalance: parseFloat(balance) },
    });
  } catch (err) {
    await conn.rollback();
    console.error('[transfer]', err.message);
    return res.status(500).json({ success: false, message: err.message || 'Transfer failed' });
  } finally {
    conn.release();
  }
};

// ─── GET /api/profile ──────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT uid, username, email, phone, role, balance, created_at FROM kodusar WHERE uid = ? LIMIT 1',
      [req.user.uid]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    const u = rows[0];
    return res.json({
      success: true,
      data: { ...u, balance: parseFloat(u.balance), accountNumber: String(u.uid).padStart(12, '4000') },
    });
  } catch (err) {
    console.error('[getProfile]', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getTransactions, transfer, transferRules, getProfile };
