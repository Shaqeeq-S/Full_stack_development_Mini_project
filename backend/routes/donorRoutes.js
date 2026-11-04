const express = require('express');
const router = express.Router();
const {
  searchDonors,
  getAllDonors,
  getDonorById,
  createDonor,
  updateDonor,
  deleteDonor,
  updateAvailability,
  getDonorRelevantRequests
} = require('../controllers/donorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public search
router.get('/search', searchDonors);

// Donor-specific protected routes
router.get('/me/requests', protect, authorize('donor'), getDonorRelevantRequests);
router.patch('/availability', protect, authorize('donor'), updateAvailability);

// General CRUD
router.get('/', getAllDonors);
router.post('/', protect, createDonor);
router.get('/:id', getDonorById);
router.put('/:id', protect, updateDonor);
router.delete('/:id', protect, deleteDonor);

module.exports = router;
