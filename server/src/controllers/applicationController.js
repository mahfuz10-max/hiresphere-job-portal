const Application = require('../models/Application');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Apply to a job with 1-click using saved profile + resume
// @route   POST /api/jobs/:id/apply
// @access  Private (JOB_SEEKER)
const applyToJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job || !job.isActive) {
    return sendResponse(res, 404, false, 'This job listing is no longer available.');
  }

  if (new Date(job.deadline) < new Date()) {
    return sendResponse(res, 400, false, 'Application deadline for this job has expired.');
  }

  const existing = await Application.findOne({
    job: job._id,
    applicant: req.user._id,
  });
  if (existing) {
    return sendResponse(res, 400, false, 'You have already applied for this job.');
  }

  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile || !profile.resumePath) {
    return sendResponse(
      res,
      400,
      false,
      'Please upload your resume in your Job Seeker Profile before applying.'
    );
  }

  const application = await Application.create({
    job: job._id,
    applicant: req.user._id,
    resumePath: profile.resumePath,
    coverNote: req.body.coverNote || '',
    status: 'Pending',
  });

  const populated = await Application.findById(application._id).populate({
    path: 'job',
    populate: { path: 'company', select: 'name logoPath location isVerified' },
  });

  return sendResponse(res, 201, true, 'Application submitted successfully!', populated);
});

// @desc    Get logged-in job seeker's applied jobs
// @route   GET /api/applications/mine
// @access  Private (JOB_SEEKER)
const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id })
    .populate({
      path: 'job',
      populate: { path: 'company', select: 'name logoPath location industry isVerified' },
    })
    .sort({ appliedAt: -1 });

  return sendResponse(res, 200, true, 'Application history retrieved.', applications);
});

// @desc    Get all applicants for a specific job (Employer)
// @route   GET /api/jobs/:id/applications
// @access  Private (EMPLOYER)
const getJobApplications = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('company', 'name isVerified');
  if (!job) {
    return sendResponse(res, 404, false, 'Job post not found.');
  }

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return sendResponse(res, 403, false, 'Not authorized to view applicants for this job.');
  }

  const applications = await Application.find({ job: job._id })
    .populate('applicant', 'name email createdAt')
    .sort({ appliedAt: -1 });

  // Attach full job seeker profile for each applicant
  const enriched = await Promise.all(
    applications.map(async (app) => {
      const seekerProfile = await Profile.findOne({ user: app.applicant?._id });
      return {
        ...app.toObject(),
        seekerProfile,
      };
    })
  );

  return sendResponse(res, 200, true, 'Job applicants retrieved.', {
    job,
    applications: enriched,
  });
});

// @desc    Update application status (Shortlist / Accept / Reject)
// @route   PATCH /api/applications/:id/status
// @access  Private (EMPLOYER)
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Shortlisted', 'Accepted', 'Rejected'];

  if (!validStatuses.includes(status)) {
    return sendResponse(res, 400, false, 'Invalid application status value.');
  }

  const application = await Application.findById(req.params.id).populate('job');
  if (!application) {
    return sendResponse(res, 404, false, 'Application record not found.');
  }

  if (application.job.postedBy.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'Not authorized to update this application.');
  }

  application.status = status;
  await application.save();

  return sendResponse(
    res,
    200,
    true,
    `Application status updated to ${status}.`,
    application
  );
});

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
