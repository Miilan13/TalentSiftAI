// Authentication Routes
const express = require('express');
const router = express.Router();
const {
  registerCandidate,
  registerCompany,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register/candidate
router.post('/register/candidate', registerCandidate);

// @route   POST /api/auth/register/company
router.post('/register/company', registerCompany);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/profile
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/change-password
router.put('/change-password', protect, changePassword);

// @route   POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;
