const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  comment: { type: String, required: true },
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
  vendorReply: { text: String, date: Date },
}, { timestamps: true });

// One review per product per buyer
reviewSchema.index({ product: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
