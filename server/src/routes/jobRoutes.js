const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getRecommendedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');
const {
  applyToJob,
  getJobApplications,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');

const router = express.Router();

const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('requirements').trim().notEmpty().withMessage('Job requirements are required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType')
    .isIn(['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'])
    .withMessage('Invalid job type'),
  body('salaryMin').isNumeric().withMessage('Minimum salary must be a number'),
  body('salaryMax').isNumeric().withMessage('Maximum salary must be a number'),
  body('deadline').notEmpty().withMessage('Application deadline is required'),
];

// Employer specific list route (must come before /:id)
router.get('/mine/list', protect, authorize('EMPLOYER'), getMyJobs);

// Personalized Job Seeker recommendations route (must come before /:id)
router.get('/recommendations', protect, getRecommendedJobs);

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Employer CRUD routes
router.post('/', protect, authorize('EMPLOYER'), jobValidation, validateRequest, createJob);
router.put('/:id', protect, authorize('EMPLOYER'), updateJob);
router.delete('/:id', protect, authorize('EMPLOYER', 'ADMIN'), deleteJob);

// Job applications sub-routes
router.post('/:id/apply', protect, authorize('JOB_SEEKER'), applyToJob);
router.get('/:id/applications', protect, authorize('EMPLOYER', 'ADMIN'), getJobApplications);

module.exports = router;
