const Property = require('../models/Property.model');
const Booking = require('../models/Booking.model');
const { cloudinary } = require('../config/cloudinary');

exports.getAllProperties = async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, furnished, parking, petFriendly, page = 1, limit = 10 } = req.query;
    const filter = { isApproved: true, status: { $in: ['available', 'rented'] } };
    if (city) filter['address.city'] = new RegExp(city, 'i');
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (furnished === 'true') filter['features.furnished'] = true;
    if (parking === 'true') filter['features.parking'] = true;
    if (petFriendly === 'true') filter['features.petFriendly'] = true;

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('owner', 'name email phone avatar')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    res.json({ success: true, total, page: Number(page), properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name email phone avatar');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProperty = async (req, res) => {
  try {
    const body = req.body;
    const safeJSON = (val, fallback) => {
      try { return typeof val === 'string' ? JSON.parse(val) : val || fallback; }
      catch { return fallback; }
    };
    const data = {
      owner: req.user._id,
      title: body.title,
      description: body.description,
      type: body.type,
      price: Number(body.price),
      address: safeJSON(body.address, {}),
      location: safeJSON(body.location, {}),
      features: safeJSON(body.features, {}),
      amenities: safeJSON(body.amenities, []),
      images: req.files?.length > 0 ? req.files.map(f => f.path) : [],
    };
    const property = await Property.create(data);
    res.status(201).json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    const body = req.body;
    const safeJSON = (val, fallback) => {
      try { return typeof val === 'string' ? JSON.parse(val) : val || fallback; }
      catch { return fallback; }
    };
    const data = {
      title: body.title,
      description: body.description,
      type: body.type,
      price: Number(body.price),
      address: safeJSON(body.address, {}),
      location: safeJSON(body.location, {}),
      features: safeJSON(body.features, {}),
      amenities: safeJSON(body.amenities, []),
    };
    if (req.files?.length > 0) data.images = req.files.map(f => f.path);
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      data, { new: true, runValidators: true }
    );
    if (!property) return res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
    res.json({ success: true, property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (property?.images?.length > 0) {
      for (const url of property.images) {
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, properties });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getOwnerAnalytics = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id });
    const propertyIds = properties.map(p => p._id);

    const bookings = await Booking.find({ owner: req.user._id });

    // Monthly revenue last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Booking.aggregate([
      { $match: { owner: req.user._id, status: { $in: ['approved','completed'] }, createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, bookings: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Per-property stats
    const propertyStats = await Booking.aggregate([
      { $match: { owner: req.user._id } },
      { $group: { _id: '$property', totalBookings: { $sum: 1 }, revenue: { $sum: '$totalAmount' }, approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } } } }
    ]);

    const totalRevenue = bookings.filter(b => ['approved','completed'].includes(b.status)).reduce((s, b) => s + b.totalAmount, 0);
    const totalViews = properties.reduce((s, p) => s + (p.views || 0), 0);

    res.json({ success: true, analytics: {
      totalProperties: properties.length,
      totalBookings: bookings.length,
      totalRevenue,
      totalViews,
      availableCount: properties.filter(p => p.status === 'available').length,
      rentedCount: properties.filter(p => p.status === 'rented').length,
      monthlyRevenue,
      propertyStats,
    }});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
