const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String, required: true, trim: true },
  storeSlug: { type: String, unique: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  contact: {
    email: String,
    phone: String,
    website: String,
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  businessInfo: {
    registrationNumber: String,
    taxId: String,
    bankAccount: String,
  },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 10 }, // Platform takes 10%
  status: { type: String, enum: ['pending', 'approved', 'suspended'], default: 'pending' },
  stripeAccountId: { type: String, default: '' },
  paypalEmail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
