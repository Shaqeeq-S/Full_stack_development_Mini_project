const mongoose = require('mongoose');

const donorResponseSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true
    },
    donorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    response: {
      type: String,
      enum: ['Accepted', 'Rejected'],
      required: true
    },
    respondedAt: {
      type: Date,
      default: Date.now
    },
    message: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: true }
);

const bloodRequestSchema = new mongoose.Schema(
  {
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    patientName: {
      type: String,
      required: [true, 'Please provide patient name'],
      trim: true
    },
    contactNumber: {
      type: String,
      required: [true, 'Please provide contact number'],
      trim: true
    },
    bloodGroup: {
      type: String,
      required: [true, 'Please select required blood group'],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      uppercase: true,
      trim: true
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Please provide units required'],
      min: [1, 'At least 1 unit is required']
    },
    hospitalName: {
      type: String,
      required: [true, 'Please provide hospital name'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Please provide hospital address'],
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
    requiredDate: {
      type: Date,
      default: Date.now
    },
    additionalNotes: {
      type: String,
      trim: true,
      default: ''
    },
    priority: {
      type: String,
      enum: ['Normal', 'Urgent', 'Emergency'],
      default: 'Normal'
    },
    status: {
      type: String,
      enum: ['Pending', 'Donor Found', 'Accepted', 'Fulfilled', 'Cancelled'],
      default: 'Pending'
    },
    donorResponses: [donorResponseSchema]
  },
  {
    timestamps: true
  }
);

bloodRequestSchema.index({ bloodGroup: 1, status: 1 });
bloodRequestSchema.index({ city: 1, state: 1 });
bloodRequestSchema.index({ priority: 1, createdAt: -1 });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
