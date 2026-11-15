const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, companyName } = req.body;

  const allowedRoles = ['JOB_SEEKER', 'EMPLOYER'];
  const assignedRole = allowedRoles.includes(role) ? role : 'JOB_SEEKER';

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return sendResponse(res, 400, false, 'An account with this email already exists.');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: assignedRole,
  });

  if (assignedRole === 'JOB_SEEKER') {
    await Profile.create({
      user: user._id,
      headline: 'Aspiring Professional',
      skills: [],
    });
  } else if (assignedRole === 'EMPLOYER') {
    await Company.create({
      owner: user._id,
      name: companyName && companyName.trim() ? companyName.trim() : `${name}'s Company`,
      industry: 'Technology',
      location: 'Dhaka, Bangladesh',
      size: '11-50 employees',
    });
  }

  const token = signToken(user._id);

  return sendResponse(res, 201, true, 'Registration successful.', {
    token,
    user: user.toJSON(),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) {
    return sendResponse(res, 401, false, 'Invalid email or password.');
  }

  if (user.isBlocked) {
    return sendResponse(
      res,
      403,
      false,
      'Your account has been blocked by the administrator. Please contact support.'
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return sendResponse(res, 401, false, 'Invalid email or password.');
  }

  const token = signToken(user._id);

  return sendResponse(res, 200, true, 'Logged in successfully.', {
    token,
    user: user.toJSON(),
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  let extra = null;
  if (req.user.role === 'JOB_SEEKER') {
    extra = await Profile.findOne({ user: req.user._id });
  } else if (req.user.role === 'EMPLOYER') {
    extra = await Company.findOne({ owner: req.user._id });
  }

  return sendResponse(res, 200, true, 'Current user retrieved.', {
    user: req.user,
    profileOrCompany: extra,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
