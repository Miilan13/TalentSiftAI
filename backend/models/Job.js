// Enhanced Job Model
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  experienceYears: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 10
    }
  },
  salary: {
    min: {
      type: Number
    },
    max: {
      type: Number
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },
  location: {
    city: String,
    state: String,
    country: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  category: {
    type: String,
    enum: ['Technology', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Other'],
    default: 'Technology'
  },
  requirements: {
    education: String,
    certifications: [String],
    languages: [String]
  },
  benefits: [String],
  applicationDeadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'expired'],
    default: 'active'
  },
  visibility: {
    type: String,
    enum: ['public', 'company-only', 'private'],
    default: 'public'
  },
  // Job Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    }
  },
  // AI Screening Settings
  aiScreening: {
    enabled: {
      type: Boolean,
      default: true
    },
    minimumScore: {
      type: Number,
      default: 60,
      min: 0,
      max: 100
    },
    autoShortlist: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for search optimization
JobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
JobSchema.index({ company: 1, status: 1 });
JobSchema.index({ createdAt: -1 });

// Virtual for full location
JobSchema.virtual('fullLocation').get(function() {
  if (this.location.remote) return 'Remote';
  const locationParts = [this.location.city, this.location.state, this.location.country].filter(Boolean);
  return locationParts.join(', ');
});

// Method to increment view count
JobSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

// Method to increment application count
JobSchema.methods.incrementApplications = function() {
  this.stats.applications += 1;
  return this.save();
};

module.exports = mongoose.model('Job', JobSchema);