const express = require('express');
const { getEmployerStats } = require('../controllers/employerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, authorize('EMPLOYER'), getEmployerStats);

module.exports = router;
