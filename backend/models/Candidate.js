// Enhanced Candidate Model with Application Details
const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  // Application Details
  applicationDetails: {
    coverLetter: String,
    expectedSalary: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR'
      }
    },
    availableFrom: Date,
    noticePeriod: {
      type: String,
      enum: ['immediate', '15-days', '1-month', '2-months', '3-months', 'other']
    },
    willingToRelocate: {
      type: Boolean,
      default: false
    }
  },
  // Resume Information
  resume: {
    filename: {
      type: String,
      required: true
    },
    originalName: String,
    fileSize: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  // AI Analysis Results
  analysis: {
    personalInfo: Object,
    education: Object,
    workExperience: Object,
    skills: [String],
    projects: Object,
    certifications: Object,
    summary: String,
    // AI Scoring
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    skillMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    experienceMatch: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendations: [String]
  },
  // Application Status and Timeline
  status: {
    type: String,
    enum: ['applied', 'screening', 'shortlisted', 'interview-scheduled', 'interviewed', 'selected', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  statusHistory: [{
    status: String,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  // HR Notes and Feedback
  hrNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: true
    }
  }],
  // Communication History
  communications: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'message']
    },
    subject: String,
    content: String,
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  // Application Metadata
  source: {
    type: String,
    enum: ['website', 'referral', 'job-board', 'social-media', 'direct'],
    default: 'website'
  },
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isBookmarked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
CandidateSchema.index({ job: 1, status: 1 });
CandidateSchema.index({ company: 1, status: 1 });
CandidateSchema.index({ user: 1 });
CandidateSchema.index({ 'analysis.overallScore': -1 });
CandidateSchema.index({ createdAt: -1 });

// Virtual for application duration
CandidateSchema.virtual('applicationDuration').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to update status with history
CandidateSchema.methods.updateStatus = function(newStatus, changedBy, notes) {
  this.statusHistory.push({
    status: this.status,
    changedBy,
    notes
  });
  this.status = newStatus;
  return this.save();
};

// Method to add HR note
CandidateSchema.methods.addHRNote = function(note, addedBy, isPrivate = true) {
  this.hrNotes.push({
    note,
    addedBy,
    isPrivate
  });
  return this.save();
};

module.exports = mongoose.model('Candidate', CandidateSchema);