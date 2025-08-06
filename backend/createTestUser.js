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

    // Create a test company first
    const testCompany = await Company.create({
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
      }
    });

    // Create test HR user
    const hrUser = await User.create({
      name: 'HR Manager',
      email: 'hr@demo.com',
      password: 'password123',
      phone: '+1234567890',
      role: 'hr',
      company: testCompany._id,
      status: 'active'
    });

    // Create test candidate user
    const candidateUser = await User.create({
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
