// routes/users.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
});

router.put('/profile', protect, async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, { name, phone, avatar }, { new: true });
  res.json({ success: true, user });
});

router.post('/address', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

router.post('/wishlist/:productId', protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  const idx = user.wishlist.indexOf(req.params.productId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(req.params.productId);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

module.exports = router;
