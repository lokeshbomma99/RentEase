const router = require('express').Router();
const {
  getAllProperties, getPropertyById, createProperty,
  updateProperty, deleteProperty, getOwnerProperties, getOwnerAnalytics
} = require('../controllers/property.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllProperties);
router.get('/owner/my-properties', protect, authorize('owner', 'admin'), getOwnerProperties);
router.get('/owner/analytics', protect, authorize('owner', 'admin'), getOwnerAnalytics);
router.get('/:id', getPropertyById);
router.post('/', protect, authorize('owner', 'admin'), upload.array('images', 8), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), upload.array('images', 8), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
