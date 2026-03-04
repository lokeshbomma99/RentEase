const router = require('express').Router();
const { addReview, getPropertyReviews, deleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, addReview);
router.get('/property/:propertyId', getPropertyReviews);
router.delete('/:id', protect, deleteReview);

module.exports = router;
