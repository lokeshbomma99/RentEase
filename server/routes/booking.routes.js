const router = require('express').Router();
const {
  createBooking, getUserBookings, getOwnerBookings,
  updateBookingStatus, cancelBooking
} = require('../controllers/booking.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('user'), createBooking);
router.get('/my-bookings', protect, authorize('user'), getUserBookings);
router.get('/owner-bookings', protect, authorize('owner', 'admin'), getOwnerBookings);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateBookingStatus);
router.put('/:id/cancel', protect, authorize('user'), cancelBooking);

module.exports = router;
