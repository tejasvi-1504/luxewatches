const router = require('express').Router();
const { getProducts, getProduct, getFeatured, getRelated, addReview, createProduct, updateProduct, deleteProduct, adminGetProducts, manageReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/:slug', getProduct);
router.get('/:id/related', getRelated);
router.post('/:id/reviews', protect, addReview);

// Admin
router.get('/admin/all', protect, admin, adminGetProducts);
router.post('/admin/create', protect, admin, createProduct);
router.put('/admin/:id', protect, admin, updateProduct);
router.delete('/admin/:id', protect, admin, deleteProduct);
router.put('/admin/:productId/reviews/:reviewId', protect, admin, manageReview);

module.exports = router;
