const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');
const Company = require('./models/Company');
const User = require('./models/User');

async function testJobCreation() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const company = await Company.findOne({ email: 'company@test.com' });
    const hrUser = await User.findOne({ email: 'hr@demo.com' });
    
    if (!company || !hrUser) {
      console.log('Test company or HR user not found');
      return;
    }
    
    console.log('Company ID:', company._id);
    console.log('HR User ID:', hrUser._id);
    
    const jobsCount = await Job.countDocuments({ company: company._id });
    console.log('Current jobs count for company:', jobsCount);
    
    // List existing jobs
    const existingJobs = await Job.find({ company: company._id }).select('title status createdAt');
    console.log('Existing jobs:', existingJobs);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testJobCreation();
