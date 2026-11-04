const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  updateRequestStatus,
  respondToRequest,
  getRequestResponses,
  getPublicStats
} = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public stats for homepage
router.get('/stats/public', getPublicStats);

// Request list & create
router.get('/', getAllRequests);
router.post('/', protect, createRequest);

// Specific request operations
router.get('/:id', getRequestById);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);
router.patch('/:id/status', protect, updateRequestStatus);

// Donor response
router.post('/:id/respond', protect, authorize('donor'), respondToRequest);
router.get('/:id/responses', protect, getRequestResponses);

module.exports = router;
