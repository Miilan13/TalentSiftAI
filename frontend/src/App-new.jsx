// TalentSift AI - Main App Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import PricingPage from './pages/public/PricingPage';
import ContactPage from './pages/public/ContactPage';
import JobsPage from './pages/public/JobsPage';
import JobDetailPage from './pages/public/JobDetailPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import CandidateProfile from './pages/candidate/CandidateProfile';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import ManageJobs from './pages/hr/ManageJobs';
import ViewApplications from './pages/hr/ViewApplications';
import CompanyProfile from './pages/hr/CompanyProfile';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Candidate Protected Routes */}
              <Route
                path="/candidate/dashboard"
                element={
                  <ProtectedRoute role="candidate">
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/applications"
                element={
                  <ProtectedRoute role="candidate">
                    <MyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/profile"
                element={
                  <ProtectedRoute role="candidate">
                    <CandidateProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* HR Protected Routes */}
              <Route
                path="/hr/dashboard"
                element={
                  <ProtectedRoute role="hr">
                    <HRDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/jobs"
                element={
                  <ProtectedRoute role="hr">
                    <ManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/applications"
                element={
                  <ProtectedRoute role="hr">
                    <ViewApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/company"
                element={
                  <ProtectedRoute role="hr">
                    <CompanyProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
