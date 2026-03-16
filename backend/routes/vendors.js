// routes/vendors.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Vendor = require('../models/Vendor');

router.get('/', async (req, res) => {
  const vendors = await Vendor.find({ status: 'approved' }).populate('user', 'name email avatar');
  res.json({ success: true, vendors });
});

router.get('/:id', async (req, res) => {
  const vendor = await Vendor.findById(req.params.id).populate('user', 'name avatar');
  if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
  res.json({ success: true, vendor });
});

router.put('/profile', protect, authorize('vendor'), async (req, res) => {
  const vendor = await Vendor.findOneAndUpdate({ user: req.user.id }, req.body, { new: true });
  res.json({ success: true, vendor });
});

router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
  const vendor = await Vendor.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
  res.json({ success: true, vendor });
});

module.exports = router;
