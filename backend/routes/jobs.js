// Job Routes
const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs,
  getJobApplications,
  getCategories
} = require('../controllers/jobController');
const { protect, hrOnly, optionalAuth } = require('../middleware/auth');

// @route   GET /api/jobs
router.get('/', optionalAuth, getJobs);

// @route   GET /api/jobs/categories
router.get('/categories', getCategories);

// @route   GET /api/jobs/company/my-jobs
router.get('/company/my-jobs', protect, hrOnly, getCompanyJobs);

// @route   POST /api/jobs
router.post('/', protect, hrOnly, createJob);

// @route   GET /api/jobs/:id
router.get('/:id', optionalAuth, getJob);

// @route   PUT /api/jobs/:id
router.put('/:id', protect, hrOnly, updateJob);

// @route   DELETE /api/jobs/:id
router.delete('/:id', protect, hrOnly, deleteJob);

// @route   GET /api/jobs/:id/applications
router.get('/:id/applications', protect, hrOnly, getJobApplications);

module.exports = router;
