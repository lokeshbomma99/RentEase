const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate:{ type: Date, required: true },
    endDate:  { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status:   {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    message:  { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
