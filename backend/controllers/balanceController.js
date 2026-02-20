const { pool } = require('../config/db');

/**
 * GET /api/balance
 * Protected – req.user populated by auth middleware.
 */
const getBalance = async (req, res) => {
  try {
    const { uid, username } = req.user;

    const [rows] = await pool.execute(
      'SELECT username, balance FROM kodusar WHERE uid = ? LIMIT 1',
      [uid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const { balance } = rows[0];

    return res.json({
      success: true,
      data: {
        username,
        balance: parseFloat(balance),
      },
    });
  } catch (err) {
    console.error('[getBalance]', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getBalance };
