const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Category = require('../models/Category');
const slugify = require('slugify');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, vendor, minPrice, maxPrice, rating, sort, search, featured } = req.query;
    const query = { isActive: true };

    if (category) {
      const cat = await Category.findOne({
        $or: [
          { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null },
          { name: { $regex: new RegExp(category, 'i') } },
          { slug: category.toLowerCase() }
        ]
      });
      if (cat) query.category = cat._id;
    }

    if (vendor) query.vendor = vendor;
    if (featured) query.isFeatured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && Number(minPrice) > 0) query.price.$gte = Number(minPrice);
      if (maxPrice && Number(maxPrice) > 0) query.price.$lte = Number(maxPrice);
    }
    if (rating) query.rating = { $gte: Number(rating) };
    if (search) query.$text = { $search: search };

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating: { rating: -1 },
      popular: { totalSales: -1 },
    };

    const products = await Product.find(query)
      .populate('vendor', 'storeName logo rating')
      .populate('category', 'name slug')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Product.countDocuments(query);
    res.json({ success: true, products, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    console.error('getProducts error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'storeName logo rating totalReviews description')
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    if (!vendor || vendor.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Vendor not approved' });
    }
    const slug = slugify(req.body.name, { lower: true }) + '-' + Date.now();
    const product = await Product.create({ ...req.body, vendor: vendor._id, slug });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    let product = await Product.findOne({ _id: req.params.id, vendor: vendor._id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.id });
    const product = await Product.findOne({ _id: req.params.id, vendor: vendor._id });
    if (!product) return res.status(404).json({ success: false, message: 'Not found or unauthorized' });
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
