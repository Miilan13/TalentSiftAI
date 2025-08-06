// Test script for TalentSift AI Backend Server
// Run this with: node backend/test-server.js

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testServer() {
  console.log('🧪 Testing TalentSift AI Backend Server...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log();

    // Test 2: Server info
    console.log('2️⃣ Testing server info...');
    const infoResponse = await axios.get(`${BASE_URL}/api`);
    console.log('✅ Server info:', infoResponse.data);
    console.log();

    // Test 3: Create a job
    console.log('3️⃣ Testing job creation...');
    const jobData = {
      title: 'Senior Software Engineer',
      description: 'We are looking for an experienced software engineer to join our team.',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      experienceYears: 5
    };
    
    const jobResponse = await axios.post(`${BASE_URL}/api/jobs`, jobData);
    console.log('✅ Job created:', jobResponse.data);
    const jobId = jobResponse.data._id;
    console.log();

    // Test 4: Get all jobs
    console.log('4️⃣ Testing get all jobs...');
    const jobsResponse = await axios.get(`${BASE_URL}/api/jobs`);
    console.log('✅ Jobs retrieved:', jobsResponse.data.length, 'jobs found');
    console.log();

    // Test 5: Get candidates for a job (should be empty initially)
    console.log('5️⃣ Testing get candidates for job...');
    const candidatesResponse = await axios.get(`${BASE_URL}/api/jobs/${jobId}/candidates`);
    console.log('✅ Candidates for job:', candidatesResponse.data.length, 'candidates found');
    console.log();

    console.log('🎉 All basic tests passed! Server is working correctly.');
    console.log('\n📝 Note: To test file upload, you need to:');
    console.log('   1. Ensure the Python AI service is running');
    console.log('   2. Use a tool like Postman to upload a resume file');
    console.log('   3. Or create a frontend form for file uploads');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Make sure the server is running on', BASE_URL);
    }
  }
}

// Run the tests
testServer();
