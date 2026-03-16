// routes/categories.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('sortOrder');
  res.json({ success: true, categories });
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category });
});

module.exports = router;
