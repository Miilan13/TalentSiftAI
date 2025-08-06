// TalentSift AI - Main App Component
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import JobsPage from './pages/JobsPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateApplications from './pages/candidate/CandidateApplications';
import CandidateProfile from './pages/candidate/CandidateProfile';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import HRManageJobs from './pages/hr/HRManageJobs';
import HRApplications from './pages/hr/HRApplications';
import HRCompanyProfile from './pages/hr/HRCompanyProfile';

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
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Candidate Protected Routes */}
              <Route
                path="/candidate/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/applications"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/profile"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateProfile />
                  </ProtectedRoute>
                }
              />
              
              {/* HR Protected Routes */}
              <Route
                path="/hr/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <HRDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/jobs"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <HRManageJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/applications"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <HRApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/hr/company"
                element={
                  <ProtectedRoute allowedRoles={['hr']}>
                    <HRCompanyProfile />
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
