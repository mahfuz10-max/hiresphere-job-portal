const fs = require('fs');
const path = require('path');
const Company = require('../models/Company');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Get employer's company profile
// @route   GET /api/company
// @access  Private (EMPLOYER)
const getCompany = asyncHandler(async (req, res) => {
  let company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    company = await Company.create({
      owner: req.user._id,
      name: `${req.user.name}'s Company`,
      industry: 'Technology',
      location: 'Dhaka, Bangladesh',
      size: '11-50 employees',
    });
  }
  return sendResponse(res, 200, true, 'Company profile retrieved.', company);
});

// @desc    Create or update employer's company profile
// @route   PUT /api/company
// @access  Private (EMPLOYER)
const updateCompany = asyncHandler(async (req, res) => {
  const { name, description, website, industry, location, size } = req.body;

  let company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    company = new Company({ owner: req.user._id, name: name || `${req.user.name}'s Company` });
  }

  if (name !== undefined) company.name = name;
  if (description !== undefined) company.description = description;
  if (website !== undefined) company.website = website;
  if (industry !== undefined) company.industry = industry;
  if (location !== undefined) company.location = location;
  if (size !== undefined) company.size = size;

  await company.save();
  return sendResponse(res, 200, true, 'Company profile updated successfully.', company);
});

// @desc    Upload company logo
// @route   POST /api/company/logo
// @access  Private (EMPLOYER)
const uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendResponse(res, 400, false, 'Please select an image file to upload.');
  }

  let company = await Company.findOne({ owner: req.user._id });
  if (!company) {
    company = new Company({
      owner: req.user._id,
      name: `${req.user.name}'s Company`,
    });
  }

  if (company.logoPath && company.logoPath.startsWith('/uploads/')) {
    const oldPath = path.join(__dirname, '../..', company.logoPath);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  company.logoPath = `/uploads/${req.file.filename}`;
  await company.save();

  return sendResponse(res, 200, true, 'Company logo uploaded successfully.', {
    logoPath: company.logoPath,
    company,
  });
});

module.exports = {
  getCompany,
  updateCompany,
  uploadCompanyLogo,
};
