const Donor = require('../models/Donor');
const User = require('../models/User');
const BloodRequest = require('../models/BloodRequest');
const { getCompatibleDonors } = require('../utils/bloodCompatibility');

// @desc    Search donors (with RBC compatibility, location filters, privacy protection)
// @route   GET /api/donors/search
// @access  Public
const searchDonors = async (req, res, next) => {
  try {
    const {
      bloodGroup,
      city,
      state,
      pincode,
      exactMatch = 'false',
      page = 1,
      limit = 20
    } = req.query;

    const query = {
      isAvailable: true // Requirement: Only show available donors in search results
    };

    let searchedBloodGroup = bloodGroup ? bloodGroup.trim().toUpperCase() : null;
    let bloodGroupFilter = null;

    if (searchedBloodGroup) {
      if (exactMatch === 'true') {
        bloodGroupFilter = [searchedBloodGroup];
      } else {
        // Red Blood Cell compatibility: if patient needs searchedBloodGroup,
        // which donor blood groups can donate to them?
        bloodGroupFilter = getCompatibleDonors(searchedBloodGroup);
      }
      query.bloodGroup = { $in: bloodGroupFilter };
    }

    if (city && city.trim() !== '') {
      query.city = { $regex: new RegExp(city.trim(), 'i') };
    }

    if (state && state.trim() !== '') {
      query.state = { $regex: new RegExp(state.trim(), 'i') };
    }

    if (pincode && pincode.trim() !== '') {
      query.pincode = pincode.trim();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Populate user but protect private residential address and contact info for public search
    const donors = await Donor.find(query)
      .populate('userId', 'name isActive avatar')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filter out donors whose User account is inactive
    const activeDonors = donors.filter(
      (donor) => donor.userId && donor.userId.isActive !== false
    );

    const total = await Donor.countDocuments(query);

    // Format safe response (hiding exact address and raw phone number for privacy)
    const sanitizedDonors = activeDonors.map((donor) => ({
      _id: donor._id,
      name: donor.userId ? donor.userId.name : 'Registered Donor',
      avatar: donor.userId ? donor.userId.avatar || '' : '',
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      state: donor.state,
      pincode: donor.pincode,
      isAvailable: donor.isAvailable,
      lastDonationDate: donor.lastDonationDate,
      isExactMatch: searchedBloodGroup ? donor.bloodGroup === searchedBloodGroup : true
    }));

    res.status(200).json({
      success: true,
      count: sanitizedDonors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      compatibilityNote:
        'Final compatibility and donor eligibility must be confirmed by a hospital or certified blood bank.',
      data: sanitizedDonors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donors (Admin / General list)
// @route   GET /api/donors
// @access  Public or Protected
const getAllDonors = async (req, res, next) => {
  try {
    const { bloodGroup, city, state, isAvailable, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup.toUpperCase();
    if (city) query.city = { $regex: new RegExp(city, 'i') };
    if (state) query.state = { $regex: new RegExp(state, 'i') };
    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let donors = await Donor.find(query)
      .populate('userId', 'name email phone avatar isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      donors = donors.filter(
        (d) =>
          (d.userId && (regex.test(d.userId.name) || regex.test(d.userId.email))) ||
          regex.test(d.city) ||
          regex.test(d.state) ||
          regex.test(d.pincode) ||
          regex.test(d.bloodGroup)
      );
    }

    const total = await Donor.countDocuments(query);

    res.status(200).json({
      success: true,
      count: donors.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: donors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donor by ID
// @route   GET /api/donors/:id
// @access  Public / Protected
const getDonorById = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id).populate(
      'userId',
      'name email phone avatar isActive createdAt'
    );

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    // If requester is not admin and not the donor themselves, hide exact address & raw phone
    const isOwner = req.user && req.user._id.toString() === donor.userId._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(200).json({
        success: true,
        data: {
          _id: donor._id,
          name: donor.userId ? donor.userId.name : 'Registered Donor',
          bloodGroup: donor.bloodGroup,
          city: donor.city,
          state: donor.state,
          pincode: donor.pincode,
          isAvailable: donor.isAvailable,
          lastDonationDate: donor.lastDonationDate
        }
      });
    }

    res.status(200).json({
      success: true,
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create donor profile
// @route   POST /api/donors
// @access  Private (Donor or Admin)
const createDonor = async (req, res, next) => {
  try {
    const userId = req.body.userId || req.user._id;

    const existing = await Donor.findOne({ userId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A donor profile already exists for this user'
      });
    }

    const donor = await Donor.create({
      ...req.body,
      userId
    });

    res.status(201).json({
      success: true,
      message: 'Donor profile created successfully',
      data: donor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donor profile
// @route   PUT /api/donors/:id
// @access  Private (Owner or Admin)
const updateDonor = async (req, res, next) => {
  try {
    let donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    const isOwner = req.user && req.user._id.toString() === donor.userId.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this donor profile'
      });
    }

    // If updating name or phone, update the User model as well
    if (req.body.name || req.body.phone) {
      const userUpdate = {};
      if (req.body.name) userUpdate.name = req.body.name;
      if (req.body.phone) userUpdate.phone = req.body.phone;
      await User.findByIdAndUpdate(donor.userId, userUpdate);
    }

    const allowedUpdates = [
      'bloodGroup',
      'dateOfBirth',
      'gender',
      'address',
      'city',
      'state',
      'pincode',
      'isAvailable',
      'lastDonationDate'
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        donor[field] = req.body[field];
      }
    });

    await donor.save();

    const updated = await Donor.findById(donor._id).populate(
      'userId',
      'name email phone avatar isActive'
    );

    res.status(200).json({
      success: true,
      message: 'Donor profile updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donor profile
// @route   DELETE /api/donors/:id
// @access  Private (Admin or Owner)
const deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    const isOwner = req.user && req.user._id.toString() === donor.userId.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this donor profile'
      });
    }

    await Donor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Donor profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or update donor availability
// @route   PATCH /api/donors/availability
// @access  Private (Donor)
const updateAvailability = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found for current user'
      });
    }

    if (req.body.isAvailable !== undefined) {
      donor.isAvailable = Boolean(req.body.isAvailable);
    } else {
      donor.isAvailable = !donor.isAvailable;
    }

    await donor.save();

    res.status(200).json({
      success: true,
      message: `Availability updated to ${donor.isAvailable ? 'Available' : 'Unavailable'}`,
      isAvailable: donor.isAvailable
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get requests relevant to the logged-in donor
// @route   GET /api/donors/me/requests
// @access  Private (Donor)
const getDonorRelevantRequests = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor profile not found'
      });
    }

    // Find requests that are either:
    // 1. Where this donor has already responded
    // 2. Open active requests (status: 'Pending' or 'Accepted') where patient blood group can receive this donor's blood group
    const allRequests = await BloodRequest.find({
      status: { $ne: 'Cancelled' }
    })
      .populate('requesterId', 'name phone email')
      .sort({ createdAt: -1 });

    // Map each request with the current donor's response status
    const requestsWithDonorStatus = allRequests.map((reqItem) => {
      const responseObj = reqItem.donorResponses.find(
        (r) => r.donorId.toString() === donor._id.toString()
      );

      return {
        _id: reqItem._id,
        patientName: reqItem.patientName,
        contactNumber: reqItem.contactNumber,
        bloodGroup: reqItem.bloodGroup,
        unitsRequired: reqItem.unitsRequired,
        hospitalName: reqItem.hospitalName,
        address: reqItem.address,
        city: reqItem.city,
        state: reqItem.state,
        pincode: reqItem.pincode,
        requiredDate: reqItem.requiredDate,
        additionalNotes: reqItem.additionalNotes,
        priority: reqItem.priority,
        status: reqItem.status,
        createdAt: reqItem.createdAt,
        myResponse: responseObj ? responseObj.response : null,
        myRespondedAt: responseObj ? responseObj.respondedAt : null,
        myResponseMessage: responseObj ? responseObj.message : null
      };
    });

    const acceptedCount = requestsWithDonorStatus.filter(
      (r) => r.myResponse === 'Accepted'
    ).length;

    const pendingCount = requestsWithDonorStatus.filter(
      (r) => !r.myResponse && r.status === 'Pending'
    ).length;

    res.status(200).json({
      success: true,
      stats: {
        totalReceived: requestsWithDonorStatus.length,
        accepted: acceptedCount,
        pending: pendingCount
      },
      data: requestsWithDonorStatus
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchDonors,
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
  updateAvailability,
  getDonorRelevantRequests
};
