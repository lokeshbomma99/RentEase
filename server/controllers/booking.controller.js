const Booking = require('../models/Booking.model');
const Property = require('../models/Property.model');
const Notification = require('../models/Notification.model');
const sendEmail = require('../utils/sendEmail');
const { bookingRequestEmail, bookingConfirmedEmail, bookingRejectedEmail } = require('../utils/emailTemplates');

const createNotification = async (userId, title, message, type, link = '') => {
  try {
    await Notification.create({ user: userId, title, message, type, link });
  } catch (e) { console.error('Notification error:', e.message); }
};

exports.createBooking = async (req, res) => {
  try {
    const property = await Property.findById(req.body.property).populate('owner');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    if (property.status !== 'available') return res.status(400).json({ success: false, message: 'Property not available' });

    const booking = await Booking.create({ ...req.body, tenant: req.user._id, owner: property.owner._id });

    // Notify owner
    await createNotification(
      property.owner._id,
      'New Booking Request',
      `${req.user.name} sent a booking request for "${property.title}"`,
      'booking', '/owner/bookings'
    );
    // Email owner
    const { subject, html } = bookingRequestEmail(property.owner.name, req.user.name, property, booking);
    sendEmail({ to: property.owner.email, subject, html });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate('property', 'title address images price')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title address images price')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status, rejectionReason },
      { new: true }
    ).populate('property').populate('tenant');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (status === 'approved') {
      await Property.findByIdAndUpdate(booking.property._id, { status: 'rented' });
      await createNotification(
        booking.tenant._id, 'Booking Approved!',
        `Your booking for "${booking.property.title}" has been approved!`,
        'approval', '/my-bookings'
      );
      const { subject, html } = bookingConfirmedEmail(booking.tenant.name, booking.property, booking);
      sendEmail({ to: booking.tenant.email, subject, html });
    }

    if (status === 'rejected') {
      await createNotification(
        booking.tenant._id, 'Booking Rejected',
        `Your booking for "${booking.property.title}" was rejected. ${rejectionReason ? 'Reason: ' + rejectionReason : ''}`,
        'rejection', '/my-bookings'
      );
      const { subject, html } = bookingRejectedEmail(booking.tenant.name, booking.property, rejectionReason);
      sendEmail({ to: booking.tenant.email, subject, html });
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, tenant: req.user._id, status: 'pending' },
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found or cannot be cancelled' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
