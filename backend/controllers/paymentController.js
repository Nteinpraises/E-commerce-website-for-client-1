const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Product = require('../models/Product');

// @POST /api/payments/create-payment-intent (Stripe)
exports.createPaymentIntent = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Calculate total from DB (never trust client-side prices)
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('vendor');
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} unavailable` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      orderItems.push({
        product: product._id,
        vendor: product.vendor._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: product.price,
        quantity: item.quantity,
        subtotal: itemTotal,
        vendorPayout: itemTotal * (1 - product.vendor.commissionRate / 100),
      });
    }

    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: 'usd',
      metadata: { userId: req.user.id.toString() },
    });

    // Create pending order
    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingCost,
      tax,
      total,
      paymentMethod: 'stripe',
      paymentIntentId: paymentIntent.id,
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/webhook (Stripe webhook)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await Order.findOneAndUpdate(
      { paymentIntentId: paymentIntent.id },
      { paymentStatus: 'paid', overallStatus: 'confirmed' }
    );

    // Reduce stock
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, totalSales: item.quantity } });
      }
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    await Order.findOneAndUpdate(
      { paymentIntentId: event.data.object.id },
      { paymentStatus: 'failed' }
    );
  }

  res.json({ received: true });
};

// @POST /api/payments/paypal/create-order
exports.createPaypalOrder = async (req, res) => {
  try {
    const { items } = req.body;
    // PayPal integration - returns approval URL
    // Full PayPal SDK integration can be added here
    // Using paypal-rest-sdk or @paypal/checkout-server-sdk
    res.json({ success: true, message: 'PayPal order created', approvalUrl: '#' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/paypal/capture-order
exports.capturePaypalOrder = async (req, res) => {
  try {
    const { paypalOrderId, orderId } = req.body;
    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid', overallStatus: 'confirmed', paypalOrderId });
    res.json({ success: true, message: 'Payment captured' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
