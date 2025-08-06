// TalentSift AI - Enhanced MERN Backend Server

// **1. Dependencies & Initial Setup**
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug: Log environment variables
console.log('🔍 Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('CLIENT_URL:', process.env.CLIENT_URL);

// Initialize Express app
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Enable Express to parse JSON request bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define the port from environment variables with fallback
const PORT = process.env.PORT || 5000;

// **2. Database Connection**
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Call the database connection function
connectDB();

// **3. Import Routes**
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

// **4. API Routes**
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Root route to confirm server is working
app.get('/api', (req, res) => {
  res.json({ 
    message: 'TalentSift AI Backend Server is running!',
    version: '2.0.0',
    features: [
      'Multi-company authentication',
      'AI-powered resume analysis',
      'Subscription management',
      'Advanced job filtering',
      'Real-time application tracking'
    ],
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      applications: '/api/applications'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    aiService: process.env.AI_SERVICE_URL || 'Not configured'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size too large. Maximum size is 10MB.'
    });
  }

  if (err.message === 'Only PDF and DOC files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only PDF and DOC files are allowed.'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// **5. Start the Server**
app.listen(PORT, () => {
  console.log(`🚀 TalentSift AI Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Service URL: ${process.env.AI_SERVICE_URL || 'Not configured'}`);
  console.log(`🌐 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});
