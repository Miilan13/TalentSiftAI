# TalentSift AI - Advanced MERN Stack Job Portal

A comprehensive AI-powered talent management and recruitment platform built with modern web technologies. TalentSift AI connects job seekers with employers while providing intelligent resume analysis, job matching, and candidate screening capabilities.

## 🌟 Key Features

### 🎯 **For Job Seekers (Candidates)**
- **User Registration & Authentication**: Secure JWT-based authentication system
- **Personal Dashboard**: Real-time application tracking and profile completion metrics
- **Job Search & Filtering**: Advanced search with location, salary, and skill filters
- **One-Click Applications**: Streamlined application process with resume upload
- **Application Management**: Track application status (pending, reviewed, interviewed, etc.)
- **Profile Management**: Comprehensive profile with skills, experience, and documents
- **Job Recommendations**: AI-powered job suggestions based on profile and skills

### 🏢 **For Employers (HR)**
- **Company Registration**: Complete company profile setup with branding
- **Job Posting Management**: Create, edit, and manage job listings
- **Application Management**: View and manage all job applications
- **Candidate Screening**: AI-powered resume analysis and candidate scoring
- **Status Tracking**: Update application status throughout hiring process
- **Analytics Dashboard**: Recruitment metrics and hiring insights
- **Real-time Notifications**: Get notified of new applications and updates

### 🤖 **AI-Powered Features**
- **Resume Analysis**: Intelligent parsing of PDF and DOCX resumes
- **Skills Extraction**: Automatic identification of technical and soft skills
- **Experience Calculation**: Smart detection of work experience duration
- **Education Parsing**: Extraction of educational qualifications and institutions
- **Job Matching**: AI-based candidate-job compatibility scoring
- **Keyword Matching**: Advanced text processing for better matches

## 🏗️ Project Architecture

```
TalentSiftAI/
├── frontend/                    # React.js Client Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/        # Navbar, Footer, Layout components
│   │   │   ├── modals/        # Job application, details modals
│   │   │   └── ui/            # Form inputs, buttons, cards
│   │   ├── pages/             # Route components
│   │   │   ├── candidate/     # Candidate dashboard, profile, applications
│   │   │   ├── hr/            # HR dashboard, job management, applications
│   │   │   └── public/        # Homepage, about, pricing, jobs
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   ├── contexts/          # React Context providers
│   │   └── assets/           # Images, fonts, static files
│   ├── public/               # Public assets
│   └── package.json          # Frontend dependencies
├── backend/                     # Node.js Express Server
│   ├── controllers/           # Business logic controllers
│   │   ├── authController.js  # Authentication & user management
│   │   ├── jobController.js   # Job posting management
│   │   └── applicationController.js  # Application handling
│   ├── models/               # MongoDB data models
│   │   ├── User.js           # User authentication model
│   │   ├── Job.js            # Job posting model
│   │   ├── Candidate.js      # Job application model
│   │   └── Company.js        # Company profile model
│   ├── routes/               # API endpoint definitions
│   │   ├── auth.js           # Authentication routes
│   │   ├── jobs.js           # Job management routes
│   │   └── applications.js   # Application management routes
│   ├── middleware/           # Express middleware
│   │   └── auth.js           # JWT authentication middleware
│   ├── server.js             # Express server setup
│   └── package.json          # Backend dependencies
├── ai_service/                  # Python FastAPI AI Service
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
└── README.md                   # Project documentation
```

## �️ Technology Stack

### **Frontend**
- **React 19** - Modern React with latest features and hooks
- **Vite** - Fast build tool and development server
- **React Router v7** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Lucide React** - Beautiful SVG icons
- **Axios** - HTTP client for API communication
- **Headless UI** - Accessible UI components

### **Backend**
- **Node.js** - Runtime environment for server-side JavaScript
- **Express.js** - Fast and minimal web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password hashing and security
- **Multer** - File upload handling for resumes
- **Validator** - Input validation and sanitization
- **CORS** - Cross-origin resource sharing

### **AI Service**
- **Python** - Programming language for AI processing
- **FastAPI** - Modern, fast web framework for APIs
- **spaCy** - Advanced natural language processing
- **PyPDF** - PDF text extraction and processing
- **python-docx** - Microsoft Word document processing
- **Regular Expressions** - Pattern matching for data extraction

### **Development Tools**
- **ESLint** - JavaScript linting and code quality
- **PostCSS** - CSS processing and optimization
- **Nodemon** - Automatic server restart during development
- **Git** - Version control system

## 📋 Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - Either local installation or [MongoDB Atlas](https://cloud.mongodb.com/)
3. **Python** (v3.8 or higher) - [Download here](https://python.org/)
4. **Git** - [Download here](https://git-scm.com/)
5. **Code Editor** - VS Code recommended

## � Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Miilan13/TalentSiftAI.git
cd TalentSiftAI
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd backend
npm install
```

#### Frontend Setup
```bash
cd ../frontend
npm install
```

#### AI Service Setup
```bash
cd ../ai_service
pip install fastapi uvicorn[standard] pypdf python-docx spacy
python -m spacy download en_core_web_sm
```

### 3. Environment Configuration

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` file:
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/talentsift
# Or use MongoDB Atlas: mongodb+srv://<username>:<password>@cluster.mongodb.net/talentsift

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# AI Service
AI_SERVICE_URL=http://localhost:8000

# Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### Frontend Environment (.env)
```bash
cd ../frontend
```

Create `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_SERVICE_URL=http://localhost:8000
```

### 4. Database Setup

#### MongoDB Setup
```bash
# If using local MongoDB, ensure it's running
# For MongoDB Atlas, use the connection string in .env

# Seed the database with sample data
cd backend
npm run seed
```

### 5. Start the Application

You'll need to run three services simultaneously:

#### Terminal 1: Start Backend Server
```bash
cd backend
npm run dev  # Development mode with auto-restart
# OR
npm start    # Production mode
```

#### Terminal 2: Start Frontend Development Server
```bash
cd frontend
npm run dev
```

#### Terminal 3: Start AI Service
```bash
cd ai_service
uvicorn main:app --reload --port 8000
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (FastAPI auto-docs)

## 🧪 Testing the Application

### Backend API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Get all jobs
curl http://localhost:5000/api/jobs

# Authentication test (requires valid JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/auth/me
```

### Frontend Testing
1. **User Registration**: http://localhost:5173/register
2. **User Login**: http://localhost:5173/login
3. **Job Search**: http://localhost:5173/jobs
4. **Dashboard Access**: Login and navigate to dashboard

### File Upload Testing
Use Postman or similar tool:
- **URL**: `POST http://localhost:5000/api/applications/upload`
- **Headers**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Body**: Form-data with `resume` file and job application data

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Jobs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs` | Get all jobs with filters | No |
| POST | `/api/jobs` | Create new job posting | Yes (HR) |
| GET | `/api/jobs/:id` | Get specific job | No |
| PUT | `/api/jobs/:id` | Update job posting | Yes (HR) |
| DELETE | `/api/jobs/:id` | Delete job posting | Yes (HR) |

### Applications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/applications/apply` | Apply for a job | Yes (Candidate) |
| GET | `/api/applications/my` | Get user's applications | Yes (Candidate) |
| GET | `/api/applications/company/all` | Get company applications | Yes (HR) |
| PUT | `/api/applications/:id/status` | Update application status | Yes (HR) |

### AI Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze-resume` | Analyze resume file |
| GET | `/health` | AI service health check |

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (candidate/hr),
  phone: String,
  location: Object,
  skills: [String],
  experience: [Object],
  resume: Object,
  profileCompletion: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model
```javascript
{
  title: String,
  description: String,
  company: ObjectId (ref: Company),
  location: Object,
  jobType: String,
  workType: String,
  salary: Object,
  experienceYears: Object,
  skills: [String],
  benefits: [String],
  requirements: [String],
  applicationDeadline: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Candidate Model (Job Application)
```javascript
{
  user: ObjectId (ref: User),
  job: ObjectId (ref: Job),
  coverLetter: String,
  resumeUrl: String,
  skills: [String],
  yearsOfExperience: Number,
  status: String,
  aiAnalysis: Object,
  appliedAt: Date,
  updatedAt: Date
}
```

### Company Model
```javascript
{
  name: String,
  description: String,
  industry: String,
  size: String,
  location: Object,
  website: String,
  logo: String,
  owner: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/talentsift` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `AI_SERVICE_URL` | Python AI service URL | `http://localhost:8000` |
| `MAX_FILE_SIZE` | Max upload file size | `5242880` (5MB) |
| `UPLOAD_PATH` | File upload directory | `./uploads` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_AI_SERVICE_URL` | AI service base URL | `http://localhost:8000` |

## 🚀 Deployment

### Development Deployment
```bash
# Start all services
npm run dev:all  # If you have a script for this

# Or manually start each service:
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: AI Service
cd ai_service && uvicorn main:app --reload
```

### Production Deployment

#### Backend (Node.js)
```bash
# Using PM2 process manager
npm install -g pm2
cd backend
pm2 start ecosystem.config.js

# Or directly with Node
npm run build
npm start
```

#### Frontend (React)
```bash
cd frontend
npm run build
# Serve build files with nginx or similar
```

#### AI Service (Python)
```bash
cd ai_service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Cloud Deployment Options
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway
- **Database**: MongoDB Atlas, AWS DocumentDB
- **AI Service**: AWS Lambda, Google Cloud Run, Heroku

## 📝 Available Scripts

### Backend Scripts
| Script | Command | Description |
|--------|---------|-------------|
| **Start** | `npm start` | Run server in production mode |
| **Development** | `npm run dev` | Run with nodemon (auto-restart) |
| **Seed Database** | `npm run seed` | Populate with sample data |
| **Test** | `npm test` | Run test suite |

### Frontend Scripts  
| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Start Vite dev server |
| **Build** | `npm run build` | Build for production |
| **Preview** | `npm run preview` | Preview production build |
| **Lint** | `npm run lint` | Run ESLint |

### AI Service Scripts
| Command | Description |
|---------|-------------|
| `uvicorn main:app --reload` | Development mode |
| `uvicorn main:app --host 0.0.0.0 --port 8000` | Production mode |

## 🎨 UI/UX Features

### Design System
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Dark/Light Mode**: Automatic theme switching (if implemented)
- **Mobile First**: Responsive design for all screen sizes
- **Accessibility**: WCAG compliant components
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages and fallbacks

### User Experience
- **Progressive Web App**: Offline capabilities and app-like experience
- **Real-time Updates**: Live notifications and status updates
- **Advanced Filtering**: Multi-parameter job and candidate filtering
- **File Upload**: Drag & drop resume uploads with validation
- **Interactive Modals**: Smooth modal interactions for applications
- **Responsive Tables**: Mobile-friendly data display

## 🔐 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure stateless authentication
- **Role-based Access**: Candidate and HR role permissions
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Comprehensive validation on all inputs
- **CORS Configuration**: Proper cross-origin request handling

### File Upload Security
- **File Type Validation**: PDF and DOC/DOCX only
- **File Size Limits**: Configurable upload size restrictions
- **Malware Scanning**: File content validation
- **Secure Storage**: Protected file storage with access controls

## 🐛 Troubleshooting

### Common Issues & Solutions

#### **MongoDB Connection Errors**
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # macOS

# Verify connection string in .env
MONGO_URI=mongodb://localhost:27017/talentsift

# For MongoDB Atlas, ensure IP whitelist is configured
```

#### **AI Service Unavailable**
```bash
# Install Python dependencies
pip install -r ai_service/requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Check if service is running on correct port
curl http://localhost:8000/health
```

#### **Frontend Build Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

#### **File Upload Problems**
```bash
# Check upload directory permissions
mkdir -p backend/uploads
chmod 755 backend/uploads

# Verify multer configuration
# Check MAX_FILE_SIZE environment variable
```

#### **Authentication Issues**
```bash
# Verify JWT_SECRET is set in .env
# Check token expiration (JWT_EXPIRES_IN)
# Ensure CORS is configured for your frontend URL
```

#### **Port Already in Use**
```bash
# Find and kill process using port
lsof -ti:5000 | xargs kill  # Backend
lsof -ti:5173 | xargs kill  # Frontend  
lsof -ti:8000 | xargs kill  # AI Service

# Or use different ports in .env files
```

### Performance Tips
- Enable MongoDB indexing for frequently queried fields
- Use Redis for session storage in production
- Implement API rate limiting
- Enable gzip compression
- Use CDN for static assets
- Optimize bundle size with code splitting

## 🤝 Contributing

We welcome contributions to TalentSift AI! Here's how you can help:

### Getting Started
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/your-feature-name`
4. **Make** your changes following our coding standards
5. **Test** your changes thoroughly
6. **Commit** with descriptive messages
7. **Push** to your fork: `git push origin feature/your-feature-name`
8. **Submit** a pull request

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Areas for Contribution
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔒 Security improvements
- 🚀 Performance optimizations

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 TalentSift AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🔗 Additional Resources

### Documentation & Guides
- [React Documentation](https://react.dev/) - Learn React
- [Express.js Guide](https://expressjs.com/) - Express web framework
- [MongoDB Manual](https://docs.mongodb.com/) - Database documentation
- [Mongoose Docs](https://mongoosejs.com/) - MongoDB ODM
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Python web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite Guide](https://vitejs.dev/) - Build tool documentation

### Learning Resources
- [MDN Web Docs](https://developer.mozilla.org/) - Web development reference
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Patterns](https://reactpatterns.com/) - React design patterns
- [MongoDB University](https://university.mongodb.com/) - Free MongoDB courses

### Tools & Extensions
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [Postman](https://www.postman.com/) - API testing tool
- [VS Code Extensions](https://marketplace.visualstudio.com/search?term=react&target=VSCode) - Recommended extensions
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) - Browser extension

## 🌟 Acknowledgments

- **Open Source Community** for the amazing tools and libraries
- **MongoDB** for the flexible NoSQL database
- **React Team** for the powerful frontend framework
- **FastAPI** for the modern Python web framework
- **Tailwind CSS** for the utility-first CSS framework
- **spaCy** for natural language processing capabilities

---

## 📞 Support & Contact

If you encounter any issues or have questions:

1. **Issues**: Create a GitHub issue with detailed description
2. **Discussions**: Use GitHub Discussions for questions and ideas
3. **Documentation**: Check this README and inline code comments
4. **Community**: Join our community discussions

---

### ⭐ Star this Repository

If you find this project helpful, please consider giving it a star on GitHub! It helps others discover the project and motivates continued development.

**Happy Coding! 🚀**
