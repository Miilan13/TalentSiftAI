// Application/Candidate Controller
const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');
const axios = require('axios');
const FormData = require('form-data');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Candidate only)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, expectedSalary, availableFrom, noticePeriod, willingToRelocate } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Job is not active for applications'
      });
    }

    // Check if candidate already applied
    const existingApplication = await Candidate.findOne({
      user: req.user._id,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume file is required'
      });
    }

    // Check company subscription limits
    const company = job.company;
    if (!company.canProcessResume()) {
      return res.status(403).json({
        success: false,
        message: 'Company has reached its resume processing limit. Please try again later.'
      });
    }

    console.log(`📄 Processing resume for job: ${job.title} at ${company.name}`);

    // Prepare form data for AI service
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    // Forward file to Python AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL;
    console.log(`🤖 Sending resume to AI service: ${aiServiceUrl}`);

    let aiAnalysis = null;
    try {
      const aiResponse = await axios.post(aiServiceUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000 // 60 second timeout
      });

      aiAnalysis = aiResponse.data;
      console.log('✅ AI analysis completed');

      // Calculate matching scores
      const skillMatch = calculateSkillMatch(aiAnalysis.analysis.skills, job.requiredSkills);
      const experienceMatch = calculateExperienceMatch(aiAnalysis.analysis.work_experience, job.experienceYears);
      const overallScore = Math.round((skillMatch + experienceMatch) / 2);

      // Enhanced analysis with scoring
      aiAnalysis.analysis = {
        ...aiAnalysis.analysis,
        overallScore,
        skillMatch,
        experienceMatch,
        recommendations: generateRecommendations(skillMatch, experienceMatch, job)
      };

    } catch (aiError) {
      console.error('AI service error:', aiError.message);
      // Continue with basic application even if AI fails
      aiAnalysis = {
        filename: req.file.originalname,
        analysis: {
          personalInfo: { full_name: req.user.name },
          skills: [],
          overallScore: 0,
          skillMatch: 0,
          experienceMatch: 0,
          error: 'AI analysis failed'
        }
      };
    }

    // Create candidate application
    const candidateData = {
      user: req.user._id,
      job: jobId,
      company: job.company._id,
      applicationDetails: {
        coverLetter,
        expectedSalary: expectedSalary ? {
          amount: expectedSalary.amount,
          currency: expectedSalary.currency || 'INR'
        } : undefined,
        availableFrom,
        noticePeriod,
        willingToRelocate
      },
      resume: {
        filename: `${Date.now()}_${req.file.originalname}`,
        originalName: req.file.originalname,
        fileSize: req.file.size
      },
      analysis: aiAnalysis.analysis,
      status: 'applied'
    };

    const candidate = await Candidate.create(candidateData);

    // Update job and company stats
    await job.incrementApplications();
    await Company.findByIdAndUpdate(
      job.company._id,
      { $inc: { 'stats.totalApplications': 1 } }
    );

    // Increment company's resume processing count
    await company.incrementResumeCount();

    // Populate the response
    const populatedCandidate = await Candidate.findById(candidate._id)
      .populate('user', 'name email phone location')
      .populate('job', 'title company')
      .populate('company', 'name');

    // Auto-shortlist if AI score is high enough and enabled
    if (job.aiScreening.enabled && 
        job.aiScreening.autoShortlist && 
        aiAnalysis.analysis.overallScore >= job.aiScreening.minimumScore) {
      
      await candidate.updateStatus('shortlisted', null, 'Auto-shortlisted by AI screening');
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: populatedCandidate
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during application submission'
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
const getMyApplications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status
    } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const applications = await Candidate.find(query)
      .populate('job', 'title description location salary employmentType status')
      .populate('company', 'name logo location industry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Candidate.countDocuments(query);

    res.json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      applications
    });

  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private (Candidate owner or HR from same company)
const getApplication = async (req, res) => {
  try {
    const application = await Candidate.findById(req.params.id)
      .populate('user', 'name email phone location profileImage skills experience')
      .populate('job', 'title description requiredSkills experienceYears salary location')
      .populate('company', 'name logo description website location');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const isOwner = application.user._id.toString() === req.user._id.toString();
    const isCompanyHR = req.user.role === 'hr' && 
                       req.user.company._id.toString() === application.company._id.toString();

    if (!isOwner && !isCompanyHR) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (HR only - same company)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Candidate.findById(req.params.id)
      .populate('company');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if HR owns this application's company
    if (application.company._id.toString() !== req.user.company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    await application.updateStatus(status, req.user._id, notes);

    // Update job stats if shortlisted
    if (status === 'shortlisted') {
      await Job.findByIdAndUpdate(
        application.job,
        { $inc: { 'stats.shortlisted': 1 } }
      );
    }

    const updatedApplication = await Candidate.findById(req.params.id)
      .populate('user', 'name email')
      .populate('job', 'title')
      .populate('statusHistory.changedBy', 'name');

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add HR note to application
// @route   POST /api/applications/:id/notes
// @access  Private (HR only - same company)
const addHRNote = async (req, res) => {
  try {
    const { note, isPrivate = true } = req.body;

    const application = await Candidate.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if HR owns this application's company
    if (application.company.toString() !== req.user.company._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this application'
      });
    }

    await application.addHRNote(note, req.user._id, isPrivate);

    res.json({
      success: true,
      message: 'Note added successfully'
    });

  } catch (error) {
    console.error('Add HR note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Candidate only - own application)
const withdrawApplication = async (req, res) => {
  try {
    const application = await Candidate.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns this application
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    if (application.status === 'withdrawn') {
      return res.status(400).json({
        success: false,
        message: 'Application is already withdrawn'
      });
    }

    await application.updateStatus('withdrawn', req.user._id, 'Withdrawn by candidate');

    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });

  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to calculate skill match percentage
const calculateSkillMatch = (candidateSkills = [], requiredSkills = []) => {
  if (!requiredSkills.length) return 100;
  if (!candidateSkills.length) return 0;

  const candidateSkillsLower = candidateSkills.map(skill => skill.toLowerCase());
  const requiredSkillsLower = requiredSkills.map(skill => skill.toLowerCase());

  const matches = requiredSkillsLower.filter(skill => 
    candidateSkillsLower.some(candidateSkill => 
      candidateSkill.includes(skill) || skill.includes(candidateSkill)
    )
  ).length;

  return Math.round((matches / requiredSkills.length) * 100);
};

// Helper function to calculate experience match percentage
const calculateExperienceMatch = (workExperience, requiredExperience) => {
  if (!requiredExperience || requiredExperience.min === 0) return 100;

  // Simple extraction of years from work experience
  let candidateYears = 0;
  if (workExperience && workExperience.job_roles_and_companies) {
    candidateYears = workExperience.job_roles_and_companies.length * 1.5; // Rough estimate
  }

  const minRequired = requiredExperience.min || 0;
  const maxRequired = requiredExperience.max || minRequired + 5;

  if (candidateYears >= minRequired && candidateYears <= maxRequired) {
    return 100;
  } else if (candidateYears < minRequired) {
    return Math.max(0, Math.round((candidateYears / minRequired) * 100));
  } else {
    // Over-qualified, slight penalty
    return Math.max(80, Math.round(100 - ((candidateYears - maxRequired) * 5)));
  }
};

// Helper function to generate recommendations
const generateRecommendations = (skillMatch, experienceMatch, job) => {
  const recommendations = [];

  if (skillMatch < 60) {
    recommendations.push(`Candidate has ${skillMatch}% skill match. Consider skills assessment.`);
  } else if (skillMatch >= 80) {
    recommendations.push(`Excellent skill match (${skillMatch}%). Strong technical fit.`);
  }

  if (experienceMatch < 60) {
    recommendations.push(`Experience match is ${experienceMatch}%. May need additional training.`);
  } else if (experienceMatch >= 80) {
    recommendations.push(`Great experience match (${experienceMatch}%). Good fit for the role.`);
  }

  const overallScore = (skillMatch + experienceMatch) / 2;
  if (overallScore >= 75) {
    recommendations.push('Highly recommended candidate for interview.');
  } else if (overallScore >= 60) {
    recommendations.push('Good candidate, consider for next round.');
  } else {
    recommendations.push('May not be the best fit for this role.');
  }

  return recommendations;
};

module.exports = {
  applyForJob,
  getMyApplications,
  getApplication,
  updateApplicationStatus,
  addHRNote,
  withdrawApplication
};
