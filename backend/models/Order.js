const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 },
    variant: { name: String, value: String },
    subtotal: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    },
    trackingNumber: String,
    vendorPayout: Number,
  }],
  shippingAddress: {
    name: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String,
  },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: { type: String, enum: ['stripe', 'paypal', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentIntentId: String,
  paypalOrderId: String,
  overallStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'partially_shipped', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  notes: String,
  couponCode: String,
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
