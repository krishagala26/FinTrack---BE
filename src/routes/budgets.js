const router = require('express').Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

router.use(auth);

router.get('/', async (req, res) => {
  const q = { user: req.userId };
  if (req.query.month) q.month = req.query.month;
  res.json(await Budget.find(q));
});

router.post('/', async (req, res) => {
  const item = await Budget.create({ ...req.body, user: req.userId });
  res.status(201).json(item);
});

router.put('/:id', async (req, res) => {
  const item = await Budget.findOneAndUpdate(
    { _id: req.params.id, user: req.userId }, req.body, { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const item = await Budget.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
