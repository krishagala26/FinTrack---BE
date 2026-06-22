const router = require('express').Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

router.use(auth);

router.get('/', async (req, res) => res.json(await Goal.find({ user: req.userId })));

router.post('/', async (req, res) => {
  const item = await Goal.create({ ...req.body, user: req.userId });
  res.status(201).json(item);
});

router.put('/:id', async (req, res) => {
  const item = await Goal.findOneAndUpdate(
    { _id: req.params.id, user: req.userId }, req.body, { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.delete('/:id', async (req, res) => {
  const item = await Goal.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
