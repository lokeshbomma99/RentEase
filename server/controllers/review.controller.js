const Review = require('../models/Review.model');
const Property = require('../models/Property.model');

exports.addReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user._id });
    const reviews = await Review.find({ property: req.body.property });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Property.findByIdAndUpdate(req.body.property, { averageRating: avg.toFixed(1), totalReviews: reviews.length });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
