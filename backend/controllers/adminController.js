const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');

exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, totalVendors, recentOrders, topProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Vendor.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('buyer', 'name email'),
      Product.find().sort({ totalSales: -1 }).limit(5).populate('vendor', 'storeName'),
    ]);
    const revenue = await Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]);
    res.json({ success: true, stats: { totalUsers, totalProducts, totalOrders, totalVendors, totalRevenue: revenue[0]?.total || 0 }, recentOrders, topProducts });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const query = {};
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const users = await User.find(query).sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.json({ success: true, users, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query).populate('vendor', 'storeName').populate('category', 'name').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
    const total = await Product.countDocuments(query);
    res.json({ success: true, products, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;
    const query = {};
    if (status) query.overallStatus = status;
    const orders = await Order.find(query).populate('buyer', 'name email').sort({ createdAt: -1 }).limit(limit).skip((page - 1) * limit);
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, order });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, vendors });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, vendor });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('sortOrder');
    res.json({ success: true, categories });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
