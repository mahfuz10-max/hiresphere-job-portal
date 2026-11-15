const express = require('express');
const {
  getAdminStats,
  getAdminUsers,
  toggleBlockUser,
  deleteUser,
  verifyEmployer,
  getAdminJobs,
  deleteAdminJob,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('ADMIN'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);
router.patch('/employers/:id/verify', verifyEmployer);
router.get('/jobs', getAdminJobs);
router.delete('/jobs/:id', deleteAdminJob);

module.exports = router;
