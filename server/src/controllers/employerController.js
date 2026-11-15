const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Get employer dashboard analytics & charts
// @route   GET /api/employer/stats
// @access  Private (EMPLOYER)
const getEmployerStats = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
  const jobIds = jobs.map((j) => j._id);

  const applications = await Application.find({ job: { $in: jobIds } })
    .populate('applicant', 'name email')
    .populate('job', 'title');

  const totalJobs = jobs.length;
  const totalApplicants = applications.length;
  const pending = applications.filter((a) => a.status === 'Pending').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const accepted = applications.filter((a) => a.status === 'Accepted').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  // Bar chart data: applicants per job
  const applicantsPerJob = jobs.slice(0, 8).map((job) => {
    const count = applications.filter(
      (a) => a.job && a.job._id.toString() === job._id.toString()
    ).length;
    return {
      jobId: job._id,
      title: job.title.length > 22 ? `${job.title.slice(0, 22)}...` : job.title,
      fullTitle: job.title,
      applicants: count,
    };
  });

  // Pie chart data: applications by status
  const applicationsByStatus = [
    { name: 'Pending', value: pending, color: '#EAB308' },
    { name: 'Shortlisted', value: shortlisted, color: '#2563EB' },
    { name: 'Accepted', value: accepted, color: '#16A34A' },
    { name: 'Rejected', value: rejected, color: '#DC2626' },
  ];

  return sendResponse(res, 200, true, 'Employer dashboard statistics retrieved.', {
    company,
    cards: {
      totalJobs,
      totalApplicants,
      pending,
      shortlisted,
      accepted,
      rejected,
    },
    applicantsPerJob,
    applicationsByStatus,
    recentApplications: applications.slice(0, 6),
  });
});

module.exports = { getEmployerStats };
