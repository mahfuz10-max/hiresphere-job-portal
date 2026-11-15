const fs = require('fs');
const path = require('path');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Application = require('../models/Application');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');

// Helper: safely remove old resume file only if not referenced by any Application and not the seeded sample PDF
const safelyRemoveResumeFile = async (resumePath) => {
  if (!resumePath) return;
  if (path.basename(resumePath) === 'sample_resume_hiresphere.pdf') return;

  const stillUsed = await Application.exists({ resumePath });
  if (!stillUsed) {
    const filePath = path.join(__dirname, '../..', resumePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

// GET /api/profile
const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ user: req.user._id }).populate(
    'user',
    'name email role createdAt'
  );
  if (!profile) {
    profile = await Profile.create({ user: req.user._id });
    profile = await Profile.findById(profile._id).populate('user', 'name email role createdAt');
  }
  return sendResponse(res, 200, true, 'Profile fetched successfully.', profile);
});

// PUT /api/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, location, headline, education, skills, experience, about } = req.body;

  if (name && name.trim()) {
    await User.findByIdAndUpdate(req.user._id, { name: name.trim() });
  }

  const parsedSkills = Array.isArray(skills)
    ? skills.map((s) => String(s).trim()).filter(Boolean)
    : typeof skills === 'string'
    ? skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  let profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new Profile({ user: req.user._id });
  }

  profile.phone = phone !== undefined ? phone : profile.phone;
  profile.location = location !== undefined ? location : profile.location;
  profile.headline = headline !== undefined ? headline : profile.headline;
  profile.education = education !== undefined ? education : profile.education;
  profile.skills = skills !== undefined ? parsedSkills : profile.skills;
  profile.experience = experience !== undefined ? experience : profile.experience;
  profile.about = about !== undefined ? about : profile.about;

  await profile.save();
  const updated = await Profile.findById(profile._id).populate(
    'user',
    'name email role createdAt'
  );

  return sendResponse(res, 200, true, 'Profile updated successfully.', updated);
});

// POST /api/profile/resume
const uploadResumeFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendResponse(
      res,
      400,
      false,
      'Please select a resume file (PDF, DOC, or DOCX) to upload.'
    );
  }

  let profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    profile = new Profile({ user: req.user._id });
  }

  if (profile.resumePath) {
    await safelyRemoveResumeFile(profile.resumePath);
  }

  profile.resumePath = `/uploads/${req.file.filename}`;
  await profile.save();

  return sendResponse(res, 200, true, 'Resume uploaded successfully.', {
    resumePath: profile.resumePath,
    profile,
  });
});

// DELETE /api/profile/resume
const deleteResumeFile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile || !profile.resumePath) {
    return sendResponse(res, 404, false, 'No uploaded resume found to delete.');
  }

  await safelyRemoveResumeFile(profile.resumePath);

  profile.resumePath = '';
  await profile.save();

  return sendResponse(res, 200, true, 'Resume deleted successfully.', profile);
});

module.exports = {
  getProfile,
  updateProfile,
  uploadResumeFile,
  deleteResumeFile,
};
