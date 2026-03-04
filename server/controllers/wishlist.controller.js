const Wishlist = require('../models/Wishlist.model');

exports.toggleWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const existing = await Wishlist.findOne({ user: req.user._id, property: propertyId });
    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      return res.json({ success: true, saved: false, message: 'Removed from wishlist' });
    }
    await Wishlist.create({ user: req.user._id, property: propertyId });
    res.json({ success: true, saved: true, message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate({ path: 'property', populate: { path: 'owner', select: 'name email phone' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, wishlist: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const existing = await Wishlist.findOne({ user: req.user._id, property: propertyId });
    res.json({ success: true, saved: !!existing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
