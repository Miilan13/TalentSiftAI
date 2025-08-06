const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

// Simulate the getCompanyJobs endpoint
const Job = require('./models/Job');
const User = require('./models/User');
const Company = require('./models/Company');

async function testCompanyJobsAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find HR user to simulate req.user
    const hrUser = await User.findOne({ email: 'hr@demo.com' }).populate('company');
    
    if (!hrUser) {
      console.log('HR user not found');
      return;
    }
    
    console.log('Simulating API call with user:', hrUser.email);
    console.log('Company ID:', hrUser.company._id);
    
    // Simulate the exact query from getCompanyJobs
    const query = { company: hrUser.company._id };
    
    const jobs = await Job.find(query)
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 });
    
    const total = await Job.countDocuments(query);
    
    const response = {
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / 10),
      currentPage: 1,
      jobs
    };
    
    console.log('API Response:');
    console.log(JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testCompanyJobsAPI();
