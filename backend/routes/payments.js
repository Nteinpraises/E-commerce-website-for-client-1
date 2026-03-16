const express = require('express');
const router = express.Router();
const { createPaymentIntent, stripeWebhook, createPaypalOrder, capturePaypalOrder } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', stripeWebhook);
router.post('/paypal/create-order', protect, createPaypalOrder);
router.post('/paypal/capture-order', protect, capturePaypalOrder);

module.exports = router;
