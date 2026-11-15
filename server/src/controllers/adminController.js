const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const SavedJob = require('../models/SavedJob');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');
const escapeRegex = require('../utils/escapeRegex');

// GET /api/admin/stats
const getAdminStats = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    jobSeekers,
    employers,
    totalJobs,
    totalApplications,
    companies,
    allJobs,
    allUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'JOB_SEEKER' }),
    User.countDocuments({ role: 'EMPLOYER' }),
    Job.countDocuments(),
    Application.countDocuments(),
    Company.find().populate('owner', 'name email isBlocked'),
    Job.find().select('category createdAt'),
    User.find().select('createdAt role'),
  ]);

  const categoryMap = {};
  allJobs.forEach((job) => {
    categoryMap[job.category] = (categoryMap[job.category] || 0) + 1;
  });
  const jobsByCategory = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));

  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label,
      users: 0,
      jobs: 0,
    });
  }

  allUsers.forEach((u) => {
    const d = new Date(u.createdAt);
    const slot = months.find(
      (m) => m.year === d.getFullYear() && m.month === d.getMonth()
    );
    if (slot) slot.users += 1;
  });

  allJobs.forEach((j) => {
    const d = new Date(j.createdAt);
    const slot = months.find(
      (m) => m.year === d.getFullYear() && m.month === d.getMonth()
    );
    if (slot) slot.jobs += 1;
  });

  const growthOverTime = months.map(({ label, users, jobs }) => ({
    month: label,
    users,
    jobs,
  }));

  return sendResponse(res, 200, true, 'Admin statistics retrieved.', {
    cards: {
      totalUsers,
      jobSeekers,
      employers,
      totalJobs,
      totalApplications,
      verifiedCompanies: companies.filter((c) => c.isVerified).length,
    },
    jobsByCategory,
    growthOverTime,
    companies,
  });
});

// GET /api/admin/users
const getAdminUsers = asyncHandler(async (req, res) => {
  const { search = '', role = '' } = req.query;
  const query = {};

  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    query.$or = [{ name: regex }, { email: regex }];
  }

  if (role && role !== 'ALL') {
    query.role = role;
  }

  const users = await User.find(query).sort({ createdAt: -1 });
  const companies = await Company.find();
  const companyByOwner = {};
  companies.forEach((c) => {
    companyByOwner[c.owner.toString()] = c;
  });

  const enrichedUsers = users.map((u) => ({
    ...u.toJSON(),
    company: companyByOwner[u._id.toString()] || null,
  }));

  return sendResponse(res, 200, true, 'Users retrieved successfully.', enrichedUsers);
});

// PATCH /api/admin/users/:id/block
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return sendResponse(res, 404, false, 'User not found.');
  }

  if (user.role === 'ADMIN') {
    return sendResponse(res, 400, false, 'Administrator accounts cannot be blocked.');
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  return sendResponse(
    res,
    200,
    true,
    `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
    user
  );
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return sendResponse(res, 404, false, 'User not found.');
  }

  if (user.role === 'ADMIN') {
    return sendResponse(res, 400, false, 'Administrator accounts cannot be deleted.');
  }

  if (user.role === 'JOB_SEEKER') {
    // Keep uploaded resume files on disk so historical records or shared sample resumes are never broken
    await Promise.all([
      Profile.deleteOne({ user: user._id }),
      Application.deleteMany({ applicant: user._id }),
      SavedJob.deleteMany({ user: user._id }),
    ]);
  } else if (user.role === 'EMPLOYER') {
    const employerJobs = await Job.find({ postedBy: user._id });
    const jobIds = employerJobs.map((j) => j._id);
    await Promise.all([
      Application.deleteMany({ job: { $in: jobIds } }),
      SavedJob.deleteMany({ job: { $in: jobIds } }),
      Job.deleteMany({ postedBy: user._id }),
      Company.deleteOne({ owner: user._id }),
    ]);
  }

  await user.deleteOne();
  return sendResponse(res, 200, true, 'User account and associated data deleted.');
});

// PATCH /api/admin/employers/:id/verify
const verifyEmployer = asyncHandler(async (req, res) => {
  let company = await Company.findById(req.params.id).populate('owner', 'name email');
  if (!company) {
    company = await Company.findOne({ owner: req.params.id }).populate('owner', 'name email');
  }

  if (!company) {
    return sendResponse(res, 404, false, 'Employer company record not found.');
  }

  company.isVerified = !company.isVerified;
  await company.save();

  return sendResponse(
    res,
    200,
    true,
    `Company "${company.name}" is now ${company.isVerified ? 'Verified' : 'Unverified'}.`,
    company
  );
});

// GET /api/admin/jobs
const getAdminJobs = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  const filter = {};
  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ title: regex }, { category: regex }, { location: regex }];
  }

  const jobs = await Job.find(filter)
    .populate('company', 'name logoPath isVerified location')
    .populate('postedBy', 'name email')
    .sort({ createdAt: -1 });

  const enriched = await Promise.all(
    jobs.map(async (job) => {
      const applicantCount = await Application.countDocuments({ job: job._id });
      return {
        ...job.toObject(),
        applicantCount,
      };
    })
  );

  return sendResponse(res, 200, true, 'All job posts retrieved for moderation.', enriched);
});

// DELETE /api/admin/jobs/:id
const deleteAdminJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return sendResponse(res, 404, false, 'Job post not found.');
  }

  await Promise.all([
    Application.deleteMany({ job: job._id }),
    SavedJob.deleteMany({ job: job._id }),
    job.deleteOne(),
  ]);

  return sendResponse(res, 200, true, 'Job listing removed by administrator.');
});

module.exports = {
  getAdminStats,
  getAdminUsers,
  toggleBlockUser,
  deleteUser,
  verifyEmployer,
  getAdminJobs,
  deleteAdminJob,
};
