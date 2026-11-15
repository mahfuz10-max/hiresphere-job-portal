const SavedJob = require('../models/SavedJob');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Get saved jobs for logged-in job seeker
// @route   GET /api/saved
// @access  Private (JOB_SEEKER)
const getSavedJobs = asyncHandler(async (req, res) => {
  const saved = await SavedJob.find({ user: req.user._id })
    .populate({
      path: 'job',
      populate: { path: 'company', select: 'name logoPath location industry isVerified' },
    })
    .sort({ createdAt: -1 });

  // Filter out any deleted jobs
  const validSaved = saved.filter((item) => item.job !== null);

  return sendResponse(res, 200, true, 'Saved jobs retrieved.', validSaved);
});

// @desc    Save a job to favorites
// @route   POST /api/saved/:jobId
// @access  Private (JOB_SEEKER)
const saveJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    return sendResponse(res, 404, false, 'Job not found.');
  }

  const existing = await SavedJob.findOne({
    user: req.user._id,
    job: job._id,
  });

  if (existing) {
    return sendResponse(res, 400, false, 'Job is already in your saved list.');
  }

  const saved = await SavedJob.create({
    user: req.user._id,
    job: job._id,
  });

  return sendResponse(res, 201, true, 'Job saved to favorites.', saved);
});

// @desc    Remove a job from saved favorites
// @route   DELETE /api/saved/:jobId
// @access  Private (JOB_SEEKER)
const unsaveJob = asyncHandler(async (req, res) => {
  const removed = await SavedJob.findOneAndDelete({
    user: req.user._id,
    job: req.params.jobId,
  });

  if (!removed) {
    return sendResponse(res, 404, false, 'Saved job record not found.');
  }

  return sendResponse(res, 200, true, 'Job removed from saved list.');
});

module.exports = {
  getSavedJobs,
  saveJob,
  unsaveJob,
};
