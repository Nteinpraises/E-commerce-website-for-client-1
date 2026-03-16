const Order = require('../models/Order');
const Vendor = require('../models/Vendor');

// @GET /api/orders (buyer's orders)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('items.product', 'name images')
      .populate('items.vendor', 'storeName')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/orders/:id
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('items.product', 'name images price')
      .populate('items.vendor', 'storeName logo contact');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Check authorization
    const isOwner = order.buyer._id.toString() === req.user.id;
    const vendor = await Vendor.findOne({ user: req.user.id });
    const isVendor = vendor && order.items.some(i => i.vendor._id.toString() === vendor._id.toString());
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isVendor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/orders/vendor/all (vendor's orders)
exports.getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const orders = await Order.find({ 'items.vendor': vendor._id })
      .populate('buyer', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/orders/:orderId/items/:itemId/status (vendor updates item status)
exports.updateItemStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const vendor = await Vendor.findOne({ user: req.user.id });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const item = order.items.id(req.params.itemId);
    if (!item || item.vendor.toString() !== vendor._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    item.status = status;
    if (trackingNumber) item.trackingNumber = trackingNumber;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
