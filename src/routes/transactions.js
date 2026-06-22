const router = require('express').Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

router.use(auth);

router.get('/', async (req, res) => {
  const { type, category, from, to } = req.query;
  const q = { user: req.userId };
  if (type) q.type = type;
  if (category) q.category = category;
  if (from || to) q.date = {};
  if (from) q.date.$gte = new Date(from);
  if (to) q.date.$lte = new Date(to);
  const items = await Transaction.find(q).sort({ date: -1 });
  res.json(items);
});

router.post('/', async (req, res) => {
  const item = await Transaction.create({ ...req.body, user: req.userId });
  res.status(201).json(item);
});

router.put('/:id', async (req, res) => {
  const item = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const item = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
