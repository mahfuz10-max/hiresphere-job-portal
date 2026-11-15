const { sendResponse } = require('../utils/apiResponse');

/**
 * Central Express error handling middleware.
 */
const errorHandler = (err, _req, res, _next) => {
  console.error('[Error]:', err.message);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return sendResponse(res, 400, false, 'Uploaded file exceeds the maximum allowed size (5 MB).');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'record';
    return sendResponse(res, 400, false, `Duplicate value for ${field}. Resource already exists.`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendResponse(res, 400, false, messages[0] || 'Validation failed.');
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return sendResponse(res, 404, false, 'Requested resource was not found.');
  }

  const statusCode = err.statusCode || 500;
  return sendResponse(
    res,
    statusCode,
    false,
    err.message || 'Internal Server Error'
  );
};

module.exports = errorHandler;
