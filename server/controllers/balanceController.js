const prisma = require('../utils/prismaClient');

/**
 * GET /api/account/balance
 * Protected route – requires valid JWT cookie
 */
const getBalance = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, balance: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        balance: parseFloat(user.balance),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getBalance };
