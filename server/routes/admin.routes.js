const router = require('express').Router();
const {
  getDashboardStats, getAllUsers, toggleUserStatus,
  getPendingProperties, approveProperty,
  getAllReviews, deleteReview, broadcastEmail
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect, authorize('admin'));
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/properties/pending', getPendingProperties);
router.put('/properties/:id/approve', approveProperty);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);
router.post('/broadcast-email', broadcastEmail);

module.exports = router;
