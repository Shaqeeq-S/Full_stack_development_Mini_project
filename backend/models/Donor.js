const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please specify blood group'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      uppercase: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide date of birth']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Prefer not to say'
    },
    address: {
      type: String,
      required: [true, 'Please provide residential address'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      trim: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    lastDonationDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching and filtering
donorSchema.index({ bloodGroup: 1, isAvailable: 1 });
donorSchema.index({ city: 1, state: 1, pincode: 1 });

module.exports = mongoose.model('Donor', donorSchema);
