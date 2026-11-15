const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/apiResponse');

/**
 * Middleware to evaluate express-validator rules and return 400 on validation errors.
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0].msg;
    return sendResponse(res, 400, false, firstError, { errors: errors.array() });
  }
  next();
};

module.exports = validateRequest;
