const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/Job');
const User = require('./models/User');
const Company = require('./models/Company');

async function testJobAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Test what getCompanyJobs query returns
    const companyId = new mongoose.Types.ObjectId("6892f3d8615c64b8bf36acf3");
    
    const jobs = await Job.find({ company: companyId })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    
    console.log('Jobs found:', jobs.length);
    console.log('Jobs data:');
    jobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - Status: ${job.status} - Created: ${job.createdAt}`);
      console.log(`   Posted by: ${job.postedBy?.name || 'Unknown'}`);
      console.log(`   Description: ${job.description?.substring(0, 100)}...`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testJobAPI();
