// Application Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  applyForJob,
  getMyApplications,
  getCompanyApplications,
  getApplication,
  updateApplicationStatus,
  addHRNote,
  withdrawApplication
} = require('../controllers/applicationController');
const { protect, candidateOnly, hrOnly, checkSubscriptionLimits } = require('../middleware/auth');

// Multer configuration for resume uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF and DOC files
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'), false);
    }
  }
});

// @route   POST /api/applications/apply/:jobId
router.post('/apply/:jobId', protect, candidateOnly, checkSubscriptionLimits, upload.single('resume'), applyForJob);

// @route   GET /api/applications/my-applications
router.get('/my-applications', protect, candidateOnly, getMyApplications);

// @route   GET /api/applications/company/all-applications
router.get('/company/all-applications', protect, hrOnly, getCompanyApplications);

// @route   GET /api/applications/:id
router.get('/:id', protect, getApplication);

// @route   PUT /api/applications/:id/status
router.put('/:id/status', protect, hrOnly, updateApplicationStatus);

// @route   POST /api/applications/:id/notes
router.post('/:id/notes', protect, hrOnly, addHRNote);

// @route   PUT /api/applications/:id/withdraw
router.put('/:id/withdraw', protect, candidateOnly, withdrawApplication);

module.exports = router;
