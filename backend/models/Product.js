const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, sparse: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, default: '' },
  images: [{ url: String, public_id: String, isMain: { type: Boolean, default: false } }],
  price: { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: 0 }, // Original price for showing discount
  currency: { type: String, default: 'USD' },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  variants: [{
    name: String, // e.g. "Size", "Color"
    options: [{
      value: String,
      price: Number,
      stock: Number,
      sku: String,
    }]
  }],
  specifications: [{ key: String, value: String }],
  tags: [String],
  weight: { type: Number, default: 0 }, // in grams
  dimensions: { length: Number, width: Number, height: Number },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  freeShipping: { type: Boolean, default: false },
  shippingCost: { type: Number, default: 0 },
  minOrderQuantity: { type: Number, default: 1 },
  maxOrderQuantity: { type: Number, default: 999 },
}, { timestamps: true });

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, rating: -1 });

module.exports = mongoose.model('Product', productSchema);
