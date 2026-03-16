const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getStats, getUsers, updateUser, deleteUser,
  getProducts, updateProduct, deleteProduct,
  getOrders, updateOrder,
  getVendors, updateVendor,
  getCategories, createCategory, updateCategory, deleteCategory,
} = require('../controllers/adminController');

const admin = [protect, authorize('admin')];

// Dashboard
router.get('/stats', ...admin, getStats);

// Users
router.get('/users', ...admin, getUsers);
router.put('/users/:id', ...admin, updateUser);
router.delete('/users/:id', ...admin, deleteUser);

// Products
router.get('/products', ...admin, getProducts);
router.put('/products/:id', ...admin, updateProduct);
router.delete('/products/:id', ...admin, deleteProduct);

// Orders
router.get('/orders', ...admin, getOrders);
router.put('/orders/:id', ...admin, updateOrder);

// Vendors
router.get('/vendors', ...admin, getVendors);
router.put('/vendors/:id', ...admin, updateVendor);

// Categories
router.get('/categories', ...admin, getCategories);
router.post('/categories', ...admin, createCategory);
router.put('/categories/:id', ...admin, updateCategory);
router.delete('/categories/:id', ...admin, deleteCategory);

module.exports = router;
