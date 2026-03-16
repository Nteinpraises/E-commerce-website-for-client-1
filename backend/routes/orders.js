const express = require('express');
const router = express.Router();
const { getMyOrders, getOrder, getVendorOrders, updateItemStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyOrders);
router.get('/vendor/all', protect, authorize('vendor'), getVendorOrders);
router.get('/:id', protect, getOrder);
router.put('/:orderId/items/:itemId/status', protect, authorize('vendor', 'admin'), updateItemStatus);

module.exports = router;
