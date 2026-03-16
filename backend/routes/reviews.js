// routes/reviews.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');

router.get('/product/:productId', async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('buyer', 'name avatar')
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

router.post('/', protect, async (req, res) => {
  const review = await Review.create({ ...req.body, buyer: req.user.id });

  // Update product rating
  const reviews = await Review.find({ product: req.body.product });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(req.body.product, { rating: avgRating.toFixed(1), totalReviews: reviews.length });

  res.status(201).json({ success: true, review });
});

router.delete('/:id', protect, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ success: false, message: 'Not found' });
  if (review.buyer.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Not authorized' });
  await review.deleteOne();
  res.json({ success: true });
});

module.exports = router;
