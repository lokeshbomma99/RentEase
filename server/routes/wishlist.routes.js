const router = require('express').Router();
const { toggleWishlist, getWishlist, checkWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getWishlist);
router.get('/check/:propertyId', checkWishlist);
router.post('/toggle/:propertyId', toggleWishlist);

module.exports = router;
