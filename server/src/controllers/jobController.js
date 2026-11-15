const Job = require('../models/Job');
const Company = require('../models/Company');
const Profile = require('../models/Profile');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');
const escapeRegex = require('../utils/escapeRegex');

// @desc    Get public jobs with search, filter, and pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = asyncHandler(async (req, res) => {
  const {
    keyword = '',
    category = '',
    location = '',
    jobType = '',
    page = 1,
    limit = 10,
  } = req.query;

  const filter = { isActive: true };

  if (keyword && keyword.trim()) {
    const regex = new RegExp(escapeRegex(keyword.trim()), 'i');
    filter.$or = [
      { title: regex },
      { description: regex },
      { requirements: regex },
      { category: regex },
    ];
  }

  if (category && category.trim() && category !== 'All') {
    filter.category = new RegExp(`^${escapeRegex(category.trim())}$`, 'i');
  }

  if (location && location.trim() && location !== 'All') {
    filter.location = new RegExp(escapeRegex(location.trim()), 'i');
  }

  if (jobType && jobType.trim() && jobType !== 'All') {
    filter.jobType = jobType.trim();
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('company', 'name logoPath location industry website size isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Job.countDocuments(filter),
  ]);

  return sendResponse(res, 200, true, 'Jobs fetched successfully.', {
    jobs,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

// @desc    Get personalized recommended jobs for a Job Seeker
// @route   GET /api/jobs/recommendations
// @access  Private (JOB_SEEKER)
const getRecommendedJobs = asyncHandler(async (req, res) => {
  const [profile, applications, allActiveJobs] = await Promise.all([
    Profile.findOne({ user: req.user._id }),
    Application.find({ applicant: req.user._id }).select('job'),
    Job.find({ isActive: true })
      .populate('company', 'name logoPath location industry website size isVerified')
      .sort({ createdAt: -1 }),
  ]);

  const appliedJobIds = new Set(applications.map((a) => String(a.job)));
  const skills = Array.isArray(profile?.skills)
    ? profile.skills.map((s) => s.toLowerCase().trim()).filter(Boolean)
    : [];
  const headline = (profile?.headline || '').toLowerCase();
  const userLocation = (profile?.location || '').toLowerCase();

  const candidateJobs = allActiveJobs.filter(
    (job) => !appliedJobIds.has(String(job._id)) && new Date(job.deadline) >= new Date()
  );

  const scored = candidateJobs.map((job) => {
    const jobObj = job.toObject();
    const searchable = `${job.title} ${job.category} ${job.description} ${job.requirements}`.toLowerCase();
    let score = 0;
    const matchedSkills = [];

    skills.forEach((skill) => {
      if (skill && searchable.includes(skill)) {
        score += 15;
        matchedSkills.push(skill);
      }
    });

    if (headline && headline !== 'aspiring professional') {
      const headlineTokens = headline
        .split(/[\s,/&-]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 2 && !['and', 'the', 'for', 'specialist', 'developer', 'engineer'].includes(t));

      headlineTokens.forEach((token) => {
        if (searchable.includes(token)) {
          score += 10;
        }
      });

      if (job.category && headline.includes(job.category.toLowerCase())) {
        score += 20;
      }
    }

    if (userLocation && job.location && userLocation.includes(job.location.toLowerCase())) {
      score += 5;
    }

    if (job.company?.isVerified) {
      score += 4;
    }

    let matchReason = 'Recommended for New Candidates';
    if (matchedSkills.length > 0) {
      const displaySkills = matchedSkills
        .slice(0, 3)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(', ');
      matchReason = `Matches your skills: ${displaySkills}`;
    } else if (score >= 14) {
      matchReason = `Matches your interest in ${job.category}`;
    } else if (job.company?.isVerified) {
      matchReason = `Top Verified Employer in ${job.category}`;
    }

    return {
      ...jobObj,
      recommendationScore: score,
      matchReason,
    };
  });

  scored.sort((a, b) => {
    if (b.recommendationScore !== a.recommendationScore) {
      return b.recommendationScore - a.recommendationScore;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sendResponse(res, 200, true, 'Recommended jobs fetched successfully.', {
    recommendations: scored.slice(0, 8),
  });
});

// @desc    Get single job details by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate('company', 'name logoPath description website industry location size isVerified')
    .populate('postedBy', 'name email');

  if (!job) {
    return sendResponse(res, 404, false, 'Job listing not found.');
  }

  const applicantCount = await Application.countDocuments({ job: job._id });

  return sendResponse(res, 200, true, 'Job details retrieved.', {
    ...job.toObject(),
    applicantCount,
  });
});

// @desc    Create a new job post
// @route   POST /api/jobs
// @access  Private (EMPLOYER)
const createJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    return sendResponse(
      res,
      400,
      false,
      'Please complete your company profile before posting a job.'
    );
  }

  const {
    title,
    description,
    requirements,
    category,
    location,
    jobType,
    salaryMin,
    salaryMax,
    vacancies,
    deadline,
  } = req.body;

  if (Number(salaryMax) < Number(salaryMin)) {
    return sendResponse(
      res,
      400,
      false,
      'Maximum salary must be greater than or equal to minimum salary.'
    );
  }

  const d = new Date(deadline);
  d.setHours(23, 59, 59, 999);

  if (Number.isNaN(d.getTime()) || d < new Date()) {
    return sendResponse(res, 400, false, 'Deadline must be today or a future date.');
  }

  const job = await Job.create({
    company: company._id,
    postedBy: req.user._id,
    title,
    description,
    requirements,
    category,
    location,
    jobType,
    salaryMin: Number(salaryMin),
    salaryMax: Number(salaryMax),
    vacancies: Number(vacancies) || 1,
    deadline: d,
    isActive: true,
  });

  const populated = await Job.findById(job._id).populate(
    'company',
    'name logoPath location industry isVerified'
  );

  return sendResponse(res, 201, true, 'Job posted successfully.', populated);
});

// @desc    Update an employer's own job post
// @route   PUT /api/jobs/:id
// @access  Private (EMPLOYER)
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return sendResponse(res, 404, false, 'Job post not found.');
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return sendResponse(res, 403, false, 'You are only authorized to edit your own job posts.');
  }

  const fields = [
    'title',
    'description',
    'requirements',
    'category',
    'location',
    'jobType',
    'salaryMin',
    'salaryMax',
    'vacancies',
    'isActive',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      job[field] = req.body[field];
    }
  });

  if (req.body.deadline !== undefined) {
    const d = new Date(req.body.deadline);
    d.setHours(23, 59, 59, 999);
    if (Number.isNaN(d.getTime())) {
      return sendResponse(res, 400, false, 'Invalid deadline date.');
    }
    job.deadline = d;
  }

  if (Number(job.salaryMax) < Number(job.salaryMin)) {
    return sendResponse(res, 400, false, 'Maximum salary cannot be less than minimum salary.');
  }

  await job.save();
  const updated = await Job.findById(job._id).populate(
    'company',
    'name logoPath location industry isVerified'
  );

  return sendResponse(res, 200, true, 'Job updated successfully.', updated);
});

// @desc    Delete an employer's own job post
// @route   DELETE /api/jobs/:id
// @access  Private (EMPLOYER)
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return sendResponse(res, 404, false, 'Job post not found.');
  }

  if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
    return sendResponse(res, 403, false, 'Not authorized to delete this job post.');
  }

  await Promise.all([
    Application.deleteMany({ job: job._id }),
    SavedJob.deleteMany({ job: job._id }),
    job.deleteOne(),
  ]);

  return sendResponse(res, 200, true, 'Job post and associated records removed.');
});

// @desc    Get all jobs posted by logged-in employer
// @route   GET /api/jobs/mine/list
// @access  Private (EMPLOYER)
const getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user._id })
    .populate('company', 'name logoPath isVerified')
    .sort({ createdAt: -1 });

  const jobsWithCounts = await Promise.all(
    jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ job: job._id });
      return {
        ...job.toObject(),
        applicantCount,
      };
    })
  );

  return sendResponse(res, 200, true, 'Employer jobs retrieved.', jobsWithCounts);
});

module.exports = {
  getJobs,
  getRecommendedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
};
