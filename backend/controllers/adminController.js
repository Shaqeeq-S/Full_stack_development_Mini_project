const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');

// @desc    Get admin dashboard stats and analytics data
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    // 1. High-level metric counts
    const totalUsers = await User.countDocuments();
    const totalDonors = await Donor.countDocuments();
    const availableDonors = await Donor.countDocuments({ isAvailable: true });
    const unavailableDonors = totalDonors - availableDonors;

    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({ status: 'Pending' });
    const emergencyRequests = await BloodRequest.countDocuments({ priority: 'Emergency' });
    const fulfilledRequests = await BloodRequest.countDocuments({ status: 'Fulfilled' });
    const acceptedRequests = await BloodRequest.countDocuments({ status: 'Accepted' });

    // 2. Analytics: Blood requests by blood group
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const requestsByGroupData = await Promise.all(
      bloodGroups.map(async (bg) => {
        const count = await BloodRequest.countDocuments({ bloodGroup: bg });
        const donorCount = await Donor.countDocuments({ bloodGroup: bg });
        return {
          bloodGroup: bg,
          requests: count,
          donors: donorCount
        };
      })
    );

    // 3. Analytics: Monthly blood requests (last 6 months)
    const now = new Date();
    const monthlyRequests = [];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);

      const count = await BloodRequest.countDocuments({
        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
      });

      monthlyRequests.push({
        month: monthNames[startOfMonth.getMonth()],
        year: startOfMonth.getFullYear(),
        label: `${monthNames[startOfMonth.getMonth()]} ${startOfMonth.getFullYear().toString().slice(2)}`,
        requests: count
      });
    }

    // 4. Analytics: Donor availability breakdown
    const donorAvailabilityData = [
      { name: 'Available', value: availableDonors, color: '#16A34A' },
      { name: 'Unavailable', value: unavailableDonors, color: '#DC2626' }
    ];

    // 5. Analytics: Request status distribution
    const statuses = ['Pending', 'Accepted', 'Fulfilled', 'Cancelled', 'Donor Found'];
    const statusDistributionData = await Promise.all(
      statuses.map(async (st) => {
        const count = await BloodRequest.countDocuments({ status: st });
        return {
          status: st,
          count
        };
      })
    );

    // Recent 5 requests
    const recentRequests = await BloodRequest.find()
      .populate('requesterId', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalDonors,
          availableDonors,
          totalRequests,
          pendingRequests,
          emergencyRequests,
          fulfilledRequests,
          acceptedRequests
        },
        analytics: {
          requestsByBloodGroup: requestsByGroupData,
          monthlyRequests,
          donorAvailability: donorAvailabilityData,
          statusDistribution: statusDistributionData
        },
        recentRequests
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and role filter
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, isActive, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined && isActive !== '') query.isActive = isActive === 'true';

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/inactive status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow admin to deactivate self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own administrator account'
      });
    }

    user.isActive = req.body.isActive !== undefined ? req.body.isActive : !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} is now ${user.isActive ? 'Active' : 'Deactivated'}`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donors for admin
// @route   GET /api/admin/donors
// @access  Private (Admin)
const getAdminDonors = async (req, res, next) => {
  try {
    const { bloodGroup, isAvailable, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup.toUpperCase();
    if (isAvailable !== undefined && isAvailable !== '') query.isAvailable = isAvailable === 'true';

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

// @desc    Get all blood requests for admin
// @route   GET /api/admin/requests
// @access  Private (Admin)
const getAdminRequests = async (req, res, next) => {
  try {
    const { bloodGroup, priority, status, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (bloodGroup) query.bloodGroup = bloodGroup.toUpperCase();
    if (priority) query.priority = priority;
    if (status) query.status = status;

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { patientName: regex },
        { hospitalName: regex },
        { city: regex },
        { state: regex }
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

module.exports = {
  getAdminDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAdminDonors,
  getAdminRequests
};
