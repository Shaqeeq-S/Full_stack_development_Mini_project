const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Donor = require('../models/Donor');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'bloodconnect_super_secure_jwt_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (Donor or Recipient)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role = 'recipient',
      avatar = '',
      city,
      state,
      pincode,
      // Donor specific fields
      bloodGroup,
      dateOfBirth,
      gender,
      address,
      lastDonationDate,
      isAvailable
    } = req.body;

    // Disallow self-registering as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin account cannot be created via public registration'
      });
    }

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required basic details (name, email, phone, password)'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // If role is donor, validate donor specific fields
    if (role === 'donor') {
      if (!bloodGroup || !dateOfBirth || !city || !state || !pincode || !address) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required donor details (blood group, DOB, address, city, state, pincode)'
        });
      }
    }

    // Create user with avatar
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role,
      avatar: avatar || '',
      isActive: true
    });

    let donorProfile = null;

    if (role === 'donor') {
      donorProfile = await Donor.create({
        userId: user._id,
        bloodGroup: bloodGroup.toUpperCase(),
        dateOfBirth: new Date(dateOfBirth),
        gender: gender || 'Prefer not to say',
        address,
        city,
        state,
        pincode,
        lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        isActive: user.isActive,
        createdAt: user.createdAt,
        donorProfile: donorProfile || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password for verification
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    let donorProfile = null;
    if (user.role === 'donor') {
      donorProfile = await Donor.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || '',
        isActive: user.isActive,
        donorProfile: donorProfile || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let donorProfile = null;
    if (user.role === 'donor') {
      donorProfile = await Donor.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || '',
        isActive: user.isActive,
        createdAt: user.createdAt,
        donorProfile: donorProfile || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, phone, avatar)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    await user.save();

    let donorProfile = null;
    if (user.role === 'donor') {
      donorProfile = await Donor.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar || '',
        isActive: user.isActive,
        donorProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};
