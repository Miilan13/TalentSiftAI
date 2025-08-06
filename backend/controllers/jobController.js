// Job Controller
const Job = require('../models/Job');
const Company = require('../models/Company');
const Candidate = require('../models/Candidate');

// @desc    Get all public jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      location,
      experienceMin,
      experienceMax,
      employmentType,
      salaryMin,
      salaryMax,
      company
    } = req.query;

    // Build query
    const query = {
      status: 'active',
      visibility: 'public'
    };

    // Search in title, description, and skills
    if (search) {
      query.$text = { $search: search };
    }

    // Filters
    if (category) query.category = category;
    if (employmentType) query.employmentType = employmentType;
    if (company) query.company = company;

    // Location filter
    if (location) {
      query.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
        { 'location.country': new RegExp(location, 'i') },
        { 'location.remote': true }
      ];
    }

    // Experience range
    if (experienceMin || experienceMax) {
      query['experienceYears.min'] = {};
      if (experienceMin) query['experienceYears.min'].$gte = parseInt(experienceMin);
      if (experienceMax) query['experienceYears.max'].$lte = parseInt(experienceMax);
    }

    // Salary range
    if (salaryMin || salaryMax) {
      query['salary.min'] = {};
      if (salaryMin) query['salary.min'].$gte = parseInt(salaryMin);
      if (salaryMax) query['salary.max'].$lte = parseInt(salaryMax);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry size')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo description website location industry size')
      .populate('postedBy', 'name');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment view count if not the job poster
    if (!req.user || req.user._id.toString() !== job.postedBy._id.toString()) {
      await job.incrementViews();
    }

    res.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (HR only)
const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      company: req.user.company._id,
      postedBy: req.user._id
    };

    const job = await Job.create(jobData);

    // Update company stats
    await Company.findByIdAndUpdate(
      req.user.company._id,
      { $inc: { 'stats.totalJobs': 1 } }
    );

    const populatedJob = await Job.findById(job._id)
      .populate('company', 'name logo')
      .populate('postedBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job: populatedJob
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (HR only - own jobs)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns this job
    if (job.company.toString() !== req.user.company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('company', 'name logo')
     .populate('postedBy', 'name');

    res.json({
      success: true,
      message: 'Job updated successfully',
      job: updatedJob
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (HR only - own jobs)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns this job
    if (job.company.toString() !== req.user.company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    // Update company stats
    await Company.findByIdAndUpdate(
      req.user.company._id,
      { $inc: { 'stats.totalJobs': -1 } }
    );

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get company's jobs
// @route   GET /api/jobs/company/my-jobs
// @access  Private (HR only)
const getCompanyJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search
    } = req.query;

    const query = { company: req.user.company._id };

    if (status) query.status = status;
    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const jobs = await Job.find(query)
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs
    });

  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get job applications
// @route   GET /api/jobs/:id/applications
// @access  Private (HR only - own jobs)
const getJobApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user owns this job
    if (job.company.toString() !== req.user.company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    const query = { job: req.params.id };
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const applications = await Candidate.find(query)
      .populate('user', 'name email phone location profileImage')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Candidate.countDocuments(query);

    // Get status summary
    const statusSummary = await Candidate.aggregate([
      { $match: { job: job._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      statusSummary,
      applications
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get job categories
// @route   GET /api/jobs/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Job.distinct('category');
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getCompanyJobs,
  getJobApplications,
  getCategories
};
