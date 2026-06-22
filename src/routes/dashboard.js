const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Goal = require('../models/Goal');

router.use(auth);

router.get('/summary', async (req, res) => {
  const userId = req.userId;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);

  const txns = await Transaction.find({ user: userId, date: { $gte: start } });
  const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const byCategory = {};
  txns.filter(t => t.type === 'expense').forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });

  const byDay = {};
  txns.forEach(t => {
    const k = t.date.toISOString().slice(0, 10);
    byDay[k] = byDay[k] || { date: k, income: 0, expense: 0 };
    byDay[k][t.type] += t.amount;
  });

  const goals = await Goal.find({ user: userId });
  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);

  res.json({
    income, expense, balance: income - expense, totalSaved,
    goalCount: goals.length,
    categoryBreakdown: Object.entries(byCategory).map(([name, value]) => ({ name, value })),
    trend: Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date)),
  });
});

module.exports = router;
