const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');
const User = require('./models/User');
const Company = require('./models/Company');

async function debugJobFetch() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find HR user
    const hrUser = await User.findOne({ email: 'hr@demo.com' }).populate('company');
    if (!hrUser) {
      console.log('HR user not found');
      return;
    }
    
    console.log('HR User found:');
    console.log('- ID:', hrUser._id);
    console.log('- Name:', hrUser.name);
    console.log('- Role:', hrUser.role);
    console.log('- Company ID:', hrUser.company?._id);
    console.log('- Company Name:', hrUser.company?.name);
    console.log('- Company Status:', hrUser.company?.status);
    console.log('- Company Verification Status:', hrUser.company?.verificationStatus);
    
    // Find all jobs for this company
    const jobs = await Job.find({ company: hrUser.company._id })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    
    console.log(`\nJobs for company (${hrUser.company._id}):`, jobs.length);
    
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title}`);
      console.log(`   - ID: ${job._id}`);
      console.log(`   - Status: ${job.status}`);
      console.log(`   - Posted by: ${job.postedBy?.name || 'Unknown'}`);
      console.log(`   - Created: ${job.createdAt}`);
      console.log(`   - Required Skills: ${job.requiredSkills?.join(', ') || 'None'}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugJobFetch();
