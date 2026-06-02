const router = require('express').Router();
const { createOrder, getMyOrders, getOrder, requestRefund, getAllOrders, updateOrderStatus, handleRefund, getStats } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/refund', protect, requestRefund);

// Admin
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/admin/stats', protect, admin, getStats);
router.put('/admin/:id/status', protect, admin, updateOrderStatus);
router.put('/admin/:id/refund', protect, admin, handleRefund);

module.exports = router;
