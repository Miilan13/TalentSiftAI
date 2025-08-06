require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');

const createTestUser = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for creating test user.');

    // Check if test company exists, if not create it
    let testCompany = await Company.findOne({ email: 'company@test.com' });
    
    if (!testCompany) {
      testCompany = await Company.create({
        name: 'Test Company',
        email: 'company@test.com',
        description: 'A test company for development',
        website: 'https://testcompany.com',
        industry: 'Technology',
        size: '51-200',
        location: {
          address: '123 Test Street',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001'
        },
        status: 'active',
        verificationStatus: 'verified',
        subscription: {
          status: 'active',
          plan: 'professional'
        }
      });
      console.log('Test company created:', testCompany.name);
    } else {
      // Update existing company to ensure it's active and verified
      testCompany.status = 'active';
      testCompany.verificationStatus = 'verified';
      if (!testCompany.subscription) {
        testCompany.subscription = {};
      }
      testCompany.subscription.status = 'active';
      testCompany.subscription.plan = 'professional';
      await testCompany.save();
      console.log('Test company updated to active/verified:', testCompany.name);
    }

    // Check if HR user exists, if not create it
    let hrUser = await User.findOne({ email: 'hr@demo.com' });
    if (!hrUser) {
      hrUser = await User.create({
        name: 'HR Manager',
        email: 'hr@demo.com',
        password: 'password123',
        phone: '+1234567890',
        role: 'hr',
        company: testCompany._id,
        status: 'active'
      });
      console.log('HR user created:', hrUser.email);
    } else {
      // Update existing HR user to ensure company association
      hrUser.company = testCompany._id;
      hrUser.status = 'active';
      await hrUser.save();
      console.log('HR user updated with company association:', hrUser.email);
    }

    // Check if candidate user exists, if not create it
    let candidateUser = await User.findOne({ email: 'candidate@demo.com' });
    if (!candidateUser) {
      candidateUser = await User.create({
        name: 'John Candidate',
        email: 'candidate@demo.com',
        password: 'password123',
        phone: '+1234567891',
        role: 'candidate',
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: 3,
        location: 'San Francisco, USA',
        status: 'active'
      });
      console.log('Candidate user created:', candidateUser.email);
    } else {
      candidateUser.status = 'active';
      await candidateUser.save();
      console.log('Candidate user updated:', candidateUser.email);
    }

    console.log('Test users created successfully:');
    console.log('HR User - Email: hr@demo.com, Password: password123');
    console.log('Candidate User - Email: candidate@demo.com, Password: password123');

    await mongoose.connection.close();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
