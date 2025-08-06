// Company Model with Subscription Plans
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    default: null
  },
  industry: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '1-10'
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contact: {
    phone: String,
    alternateEmail: String
  },
  // Subscription Management
  subscription: {
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      default: 'starter'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'trial', 'expired'],
      default: 'trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: function() {
        // 7 days trial by default
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      }
    },
    resumesProcessed: {
      type: Number,
      default: 0
    },
    resumeLimit: {
      type: Number,
      default: 5 // Free trial limit
    }
  },
  // Company Statistics
  stats: {
    totalJobs: {
      type: Number,
      default: 0
    },
    totalApplications: {
      type: Number,
      default: 0
    },
    totalHires: {
      type: Number,
      default: 0
    }
  },
  // Company Settings
  settings: {
    allowPublicJobs: {
      type: Boolean,
      default: true
    },
    autoScreening: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'suspended'],
    default: 'pending'
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Virtual for subscription plan details
companySchema.virtual('subscriptionDetails').get(function() {
  const plans = {
    starter: {
      name: 'Starter Plan',
      price: 10000, // ₹10,000
      resumeLimit: 30,
      features: ['30 AI Resume Analysis', 'Basic Dashboard', 'Email Support']
    },
    professional: {
      name: 'Professional Plan', 
      price: 25000, // ₹25,000
      resumeLimit: 100,
      features: ['100 AI Resume Analysis', 'Advanced Dashboard', 'Priority Support', 'Custom Filters']
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 50000, // ₹50,000
      resumeLimit: 500,
      features: ['500 AI Resume Analysis', 'Full Dashboard', '24/7 Support', 'API Access', 'Custom Integration']
    }
  };
  return plans[this.subscription.plan];
});

// Method to check if company can process more resumes
companySchema.methods.canProcessResume = function() {
  return this.subscription.resumesProcessed < this.subscription.resumeLimit && 
         this.subscription.status === 'active';
};

// Method to increment resume count
companySchema.methods.incrementResumeCount = function() {
  this.subscription.resumesProcessed += 1;
  return this.save();
};

module.exports = mongoose.model('Company', companySchema);
