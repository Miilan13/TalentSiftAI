# TalentSift AI - Backend Server

A comprehensive Node.js backend server built with Express and MongoDB for the TalentSift AI application. This server handles job postings, candidate resume uploads, and integrates with a Python AI service for resume analysis.

## Features

- **Job Management**: Create and retrieve job postings
- **Resume Upload**: Handle candidate resume uploads with file processing
- **AI Integration**: Forward resumes to Python AI service for analysis
- **Database Storage**: MongoDB integration with Mongoose ODM
- **Candidate Tracking**: Store and manage candidate information and analysis results
- **Status Management**: Update candidate application status

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer (memory storage)
- **HTTP Client**: Axios
- **Environment**: dotenv
- **CORS**: cors middleware

## API Endpoints

### Jobs
- `POST /api/jobs` - Create a new job posting
- `GET /api/jobs` - Get all job postings
- `GET /api/jobs/:jobId/candidates` - Get all candidates for a specific job

### Candidates
- `POST /api/candidates/upload/:jobId` - Upload resume for a specific job
- `GET /api/candidates` - Get all candidates across all jobs
- `PUT /api/candidates/:candidateId/status` - Update candidate status

### System
- `GET /api` - Server info and available endpoints
- `GET /api/health` - Health check endpoint

## Data Models

### Job Model
```javascript
{
  title: String (required),
  description: String (required),
  requiredSkills: [String],
  experienceYears: Number (default: 0),
  createdAt: Date (default: now)
}
```

### Candidate Model
```javascript
{
  name: String,
  email: String,
  associatedJob: ObjectId (ref: Job, required),
  resumeFilename: String (required),
  analysis: Object (AI service response),
  status: String (enum: ['Pending', 'Shortlisted', 'Rejected']),
  uploadedAt: Date (default: now)
}
```

## Environment Variables

Create a `.env` file in the backend directory with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
AI_SERVICE_URL=http://localhost:8000/analyze/
```

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env` file

3. Ensure MongoDB is running and accessible

4. Start the Python AI service (should be running on the URL specified in AI_SERVICE_URL)

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## File Upload Process

1. Client uploads resume file to `/api/candidates/upload/:jobId`
2. Server receives file using Multer (stored in memory)
3. File is forwarded to Python AI service using FormData
4. AI service analyzes resume and returns JSON response
5. Candidate record is created with analysis results
6. Response sent back to client with candidate data

## Error Handling

The server includes comprehensive error handling for:
- Database connection failures
- File upload errors
- AI service communication issues
- Invalid request data
- Missing resources (jobs/candidates)

## Development Notes

- Uses memory storage for file uploads (files are not saved to disk)
- All routes include proper error handling and logging
- CORS enabled for cross-origin requests
- JSON request body parsing enabled
- Mongoose schema validation in place
- Populated references for related data

## Testing the API

You can test the API endpoints using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Create a job
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Software Engineer","description":"Full stack developer role","requiredSkills":["JavaScript","React","Node.js"],"experienceYears":3}'

# Upload resume (replace JOB_ID with actual job ID)
curl -X POST http://localhost:5000/api/candidates/upload/JOB_ID \
  -F "resume=@path/to/resume.pdf" \
  -F "name=John Doe" \
  -F "email=john@example.com"
```
