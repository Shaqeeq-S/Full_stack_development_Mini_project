const BloodRequest = require('../models/BloodRequest');
const Donor = require('../models/Donor');
const User = require('../models/User');

// @desc    Create a new blood request
// @route   POST /api/requests
// @access  Private (Recipient, Donor, Admin)
const createRequest = async (req, res, next) => {
  try {
    const {
      patientName,
      contactNumber,
      bloodGroup,
      unitsRequired,
      hospitalName,
      address,
      city,
      state,
      pincode,
      requiredDate,
      additionalNotes,
      priority = 'Normal',
      isEmergency = false
    } = req.body;

    if (
      !patientName ||
      !contactNumber ||
      !bloodGroup ||
      !unitsRequired ||
      !hospitalName ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required blood request fields'
      });
    }

    const requestPriority = isEmergency ? 'Emergency' : priority;

    const request = await BloodRequest.create({
      requesterId: req.user._id,
      patientName,
      contactNumber,
      bloodGroup: bloodGroup.toUpperCase(),
      unitsRequired: parseInt(unitsRequired),
      hospitalName,
      address,
      city,
      state,
      pincode,
      requiredDate: requiredDate ? new Date(requiredDate) : new Date(),
      additionalNotes: additionalNotes || '',
      priority: requestPriority,
      status: 'Pending',
      donorResponses: []
    });

    const populated = await BloodRequest.findById(request._id).populate(
      'requesterId',
      'name email phone avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Blood request created successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all blood requests with filters
// @route   GET /api/requests
// @access  Public / Protected
const getAllRequests = async (req, res, next) => {
  try {
    const {
      bloodGroup,
      priority,
      status,
      city,
      state,
      myRequests,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    if (myRequests === 'true' && req.user) {
      query.requesterId = req.user._id;
    }

    if (bloodGroup) query.bloodGroup = bloodGroup.toUpperCase();
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (city) query.city = { $regex: new RegExp(city, 'i') };
    if (state) query.state = { $regex: new RegExp(state, 'i') };

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { patientName: regex },
        { hospitalName: regex },
        { city: regex },
        { state: regex },
        { bloodGroup: regex }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await BloodRequest.find(query)
      .populate('requesterId', 'name email phone avatar')
      .populate('donorResponses.donorUserId', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await BloodRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request by ID
// @route   GET /api/requests/:id
// @access  Public / Protected
const getRequestById = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('requesterId', 'name email phone avatar')
      .populate('donorResponses.donorUserId', 'name email phone avatar')
      .populate('donorResponses.donorId', 'bloodGroup city state');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood request
// @route   PUT /api/requests/:id
// @access  Private (Requester or Admin)
const updateRequest = async (req, res, next) => {
  try {
    let request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    const isOwner = req.user && req.user._id.toString() === request.requesterId.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blood request'
      });
    }

    const allowedFields = [
      'patientName',
      'contactNumber',
      'bloodGroup',
      'unitsRequired',
      'hospitalName',
      'address',
      'city',
      'state',
      'pincode',
      'requiredDate',
      'additionalNotes',
      'priority',
      'status'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    await request.save();

    const updated = await BloodRequest.findById(request._id)
      .populate('requesterId', 'name email phone avatar')
      .populate('donorResponses.donorUserId', 'name email phone avatar');

    res.status(200).json({
      success: true,
      message: 'Blood request updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or cancel blood request
// @route   DELETE /api/requests/:id
// @access  Private (Requester or Admin)
const deleteRequest = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    const isOwner = req.user && req.user._id.toString() === request.requesterId.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete or cancel this request'
      });
    }

    // Either hard delete or mark as cancelled depending on param or flag
    if (req.query.hardDelete === 'true' && isAdmin) {
      await BloodRequest.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Blood request permanently deleted'
      });
    }

    request.status = 'Cancelled';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Blood request cancelled successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blood request status
// @route   PATCH /api/requests/:id/status
// @access  Private (Requester or Admin)
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Donor Found', 'Accepted', 'Fulfilled', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`
      });
    }

    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    const isOwner = req.user && req.user._id.toString() === request.requesterId.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change status of this request'
      });
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Donor responds to a blood request (Accept or Reject)
// @route   POST /api/requests/:id/respond
// @access  Private (Donor)
const respondToRequest = async (req, res, next) => {
  try {
    const { response, message = '' } = req.body;

    if (!['Accepted', 'Rejected'].includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Response must be either 'Accepted' or 'Rejected'"
      });
    }

    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found for logged in user'
      });
    }

    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    // Check if donor already responded
    const existingIndex = request.donorResponses.findIndex(
      (r) => r.donorId.toString() === donor._id.toString()
    );

    if (existingIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a response to this blood request'
      });
    }

    // Add donor response
    request.donorResponses.push({
      donorId: donor._id,
      donorUserId: req.user._id,
      response,
      respondedAt: new Date(),
      message
    });

    // If accepted and request is currently pending, advance status
    if (response === 'Accepted' && request.status === 'Pending') {
      request.status = 'Accepted';
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: `You have successfully ${response.toLowerCase()} this blood request`,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donor responses for a request
// @route   GET /api/requests/:id/responses
// @access  Private (Requester or Admin)
const getRequestResponses = async (req, res, next) => {
  try {
    const request = await BloodRequest.findById(req.params.id)
      .populate('donorResponses.donorUserId', 'name email phone avatar')
      .populate('donorResponses.donorId', 'bloodGroup city state isAvailable');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Blood request not found'
      });
    }

    const isOwner = req.user && req.user._id.toString() === request.requesterId.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view responses for this request'
      });
    }

    res.status(200).json({
      success: true,
      count: request.donorResponses.length,
      data: request.donorResponses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public homepage statistics from real database
// @route   GET /api/requests/stats/public
// @access  Public
const getPublicStats = async (req, res, next) => {
  try {
    const totalDonors = await Donor.countDocuments();
    const availableDonors = await Donor.countDocuments({ isAvailable: true });
    const totalRequests = await BloodRequest.countDocuments();
    const successfulRequests = await BloodRequest.countDocuments({
      status: 'Fulfilled'
    });
    const emergencyRequests = await BloodRequest.countDocuments({
      priority: 'Emergency',
      status: { $ne: 'Cancelled' }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalDonors,
        availableDonors,
        totalRequests,
        successfulRequests,
        emergencyRequests
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  updateRequestStatus,
  respondToRequest,
  getRequestResponses,
  getPublicStats
};
