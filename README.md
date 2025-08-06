# TalentSift AI - MERN Stack Application

An AI-powered resume screening and talent management system built with the MERN stack (MongoDB, Express.js, React, Node.js) integrated with Python AI services.

## 🏗️ Project Structure

```
TalentSiftAI/
├── backend/                 # Node.js Express server
│   ├── server.js           # Main server file
│   ├── seed.js             # Database seeding script
│   ├── test-server.js      # Server testing script
│   ├── .env                # Environment variables
│   ├── .env.example        # Environment template
│   └── README.md           # Backend documentation
├── ai_service/             # Python AI service
│   └── main.py            # FastAPI AI service
├── package.json           # Project dependencies
└── README.md              # This file
```

## 🚀 Features

### Backend API (Express.js + MongoDB)
- **Job Management**: Create and manage job postings
- **Resume Upload**: Handle candidate resume file uploads
- **AI Integration**: Forward resumes to Python AI service for analysis
- **Candidate Tracking**: Store candidate information and AI analysis results
- **Status Management**: Update candidate application status
- **RESTful API**: Well-structured endpoints with proper error handling

### AI Service (Python)
- **Resume Analysis**: AI-powered resume parsing and analysis
- **Skills Extraction**: Identify relevant skills from resumes
- **Candidate Scoring**: Generate compatibility scores for job matches

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Multer** - File upload handling
- **Axios** - HTTP client for AI service communication
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### AI Service
- **Python** - Programming language
- **FastAPI** - Web framework for AI service
- **ML Libraries** - For resume analysis (to be implemented)

## 📋 Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Python** (v3.8 or higher) for AI service
4. **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd TalentSiftAI

# Install Node.js dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit the .env file with your configuration
# Required variables:
# - MONGO_URI: Your MongoDB connection string
# - AI_SERVICE_URL: URL of the Python AI service
# - PORT: Server port (default: 5000)
```

### 3. Database Setup

```bash
# Seed the database with sample jobs
npm run seed
```

### 4. Start the Services

```bash
# Start the backend server
npm run dev  # Development mode with auto-restart
# OR
npm start    # Production mode

# Start the Python AI service (in a separate terminal)
cd ai_service
python main.py
```

## 🧪 Testing

### Test the Backend API
```bash
# Run the test script
npm test

# Or manually test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/jobs
```

### Test File Upload
Use Postman or similar tool to test resume upload:
- **URL**: `POST http://localhost:5000/api/candidates/upload/:jobId`
- **Body**: Form-data with `resume` file and optional `name`, `email`

## 📡 API Endpoints

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| POST | `/api/jobs` | Create new job |
| GET | `/api/jobs/:id/candidates` | Get candidates for job |

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/candidates/upload/:jobId` | Upload resume |
| GET | `/api/candidates` | Get all candidates |
| PUT | `/api/candidates/:id/status` | Update status |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api` | Server info |
| GET | `/api/health` | Health check |

## 📊 Data Models

### Job
```javascript
{
  title: String,
  description: String,
  requiredSkills: [String],
  experienceYears: Number,
  createdAt: Date
}
```

### Candidate
```javascript
{
  name: String,
  email: String,
  associatedJob: ObjectId,
  resumeFilename: String,
  analysis: Object,
  status: String,
  uploadedAt: Date
}
```

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGO_URI` | MongoDB connection string | Required |
| `AI_SERVICE_URL` | Python AI service URL | Required |
| `NODE_ENV` | Environment mode | development |

## 🚀 Deployment

### Local Development
1. Ensure MongoDB is running
2. Start AI service: `cd ai_service && python main.py`
3. Start backend: `npm run dev`

### Production
1. Set `NODE_ENV=production` in environment
2. Use process manager like PM2: `pm2 start backend/server.js`
3. Configure reverse proxy (nginx) if needed
4. Use cloud MongoDB (Atlas) for database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run server in production mode |
| Dev | `npm run dev` | Run server with auto-restart |
| Test | `npm test` | Run API tests |
| Seed | `npm run seed` | Populate database with sample data |

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify MONGO_URI in .env file

2. **AI Service Unavailable**
   - Ensure Python AI service is running
   - Check AI_SERVICE_URL in .env file

3. **File Upload Issues**
   - Check file size limits
   - Verify multer configuration

4. **CORS Issues**
   - Update CORS configuration for your frontend URL

## 📄 License

This project is licensed under the ISC License.

## 🔗 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [Multer File Upload](https://github.com/expressjs/multer)
