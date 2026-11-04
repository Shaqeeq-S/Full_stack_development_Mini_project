const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAdminDonors,
  getAdminRequests
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/donors', getAdminDonors);
router.get('/requests', getAdminRequests);

module.exports = router;
