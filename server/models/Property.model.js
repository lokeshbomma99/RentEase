const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type:        { type: String, enum: ['apartment', 'house', 'villa', 'studio', 'room'], required: true },
    status:      { type: String, enum: ['available', 'rented', 'pending', 'inactive'], default: 'available' },
    price:       { type: Number, required: true },
    address: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      zipCode: { type: String },
      country: { type: String, default: 'India' },
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    features: {
      bedrooms:    { type: Number, default: 1 },
      bathrooms:   { type: Number, default: 1 },
      area:        { type: Number },
      furnished:   { type: Boolean, default: false },
      parking:     { type: Boolean, default: false },
      petFriendly: { type: Boolean, default: false },
    },
    images:        [{ type: String }],
    amenities:     [{ type: String }],
    isApproved:    { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews:  { type: Number, default: 0 },
    views:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
