const express = require('express');
const { body } = require('express-validator');
const {
  getCompany,
  updateCompany,
  uploadCompanyLogo,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { uploadLogo } = require('../middleware/upload');
const validateRequest = require('../middleware/validate');

const router = express.Router();

router.use(protect, authorize('EMPLOYER'));

router
  .route('/')
  .get(getCompany)
  .put(
    [body('name').trim().notEmpty().withMessage('Company name is required')],
    validateRequest,
    updateCompany
  );

router.post('/logo', uploadLogo.single('logo'), uploadCompanyLogo);

module.exports = router;
