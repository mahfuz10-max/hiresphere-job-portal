const express = require('express');
const {
  getProfile,
  updateProfile,
  uploadResumeFile,
  deleteResumeFile,
} = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');

const router = express.Router();

router.use(protect, authorize('JOB_SEEKER'));

router.route('/').get(getProfile).put(updateProfile);
router
  .route('/resume')
  .post(uploadResume.single('resume'), uploadResumeFile)
  .delete(deleteResumeFile);

module.exports = router;
