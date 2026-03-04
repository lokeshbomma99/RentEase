const User = require('../models/User.model');
const Property = require('../models/Property.model');
const Booking = require('../models/Booking.model');
const Review = require('../models/Review.model');
const sendEmail = require('../utils/sendEmail');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProperties, totalBookings, pendingProperties, totalRevenue] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      Property.countDocuments(),
      Booking.countDocuments(),
      Property.countDocuments({ isApproved: false }),
      Booking.aggregate([
        { $match: { status: { $in: ['approved', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
    ]);

    // Monthly user growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Monthly bookings
    const bookingStats = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({ success: true, stats: {
      totalUsers, totalProperties, totalBookings, pendingProperties,
      totalRevenue: totalRevenue[0]?.total || 0,
      userGrowth, bookingStats,
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ isApproved: false }).populate('owner', 'name email');
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('property', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.broadcastEmail = async (req, res) => {
  try {
    const { subject, message, targetRole } = req.body;
    const filter = targetRole && targetRole !== 'all' ? { role: targetRole, isActive: true } : { isActive: true };
    const users = await User.find(filter).select('email name');
    
    let sent = 0;
    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:linear-gradient(135deg,#2563eb,#4f46e5);padding:20px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:white;margin:0">🏠 RentEase</h1>
          </div>
          <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
            <p>Hi ${user.name},</p>
            <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0">${message}</div>
            <p style="color:#6b7280;font-size:13px;margin-top:20px">— RentEase Team</p>
          </div>
        </div>`
      });
      sent++;
    }
    res.json({ success: true, message: `Email sent to ${sent} users` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
