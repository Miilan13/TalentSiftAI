// In backend/seed.js

require('dotenv').config();
const mongoose = require('mongoose');

// We only need the Job model for seeding
const Job = require('./models/Job'); // We will create this model file next

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the client-side of our web applications.',
    requiredSkills: ['React', 'JavaScript', 'CSS', 'HTML', 'Webpack'],
    experienceYears: 5,
  },
  {
    title: 'Node.js Backend Engineer',
    description: 'Seeking a skilled Node.js engineer to develop and maintain server-side logic, define and maintain the central database, and ensure high performance and responsiveness to requests from the front-end.',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'GraphQL'],
    experienceYears: 3,
  },
  {
    title: 'Full Stack Engineer (MERN)',
    description: 'Join our dynamic team as a Full Stack Engineer. You will work on both the frontend and backend of our applications, using the MERN stack.',
    requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'],
    experienceYears: 4,
  },
];

const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected for seeding.');

    // Clear existing data
    await Job.deleteMany({});
    console.log('Existing jobs destroyed.');

    // Insert new sample data
    await Job.insertMany(sampleJobs);
    console.log('Sample jobs imported.');

    // Disconnect from the database
    await mongoose.connection.close();
    console.log('MongoDB disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('Error with database seeding:', error);
    process.exit(1);
  }
};

seedDB();