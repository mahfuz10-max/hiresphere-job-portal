const express = require('express');
const { body } = require('express-validator');
const {
  getMyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

router.get('/mine', protect, authorize('JOB_SEEKER'), getMyApplications);

router.patch(
  '/:id/status',
  protect,
  authorize('EMPLOYER'),
  [
    body('status')
      .isIn(['Pending', 'Shortlisted', 'Accepted', 'Rejected'])
      .withMessage('Status must be Pending, Shortlisted, Accepted, or Rejected'),
  ],
  validateRequest,
  updateApplicationStatus
);

module.exports = router;
