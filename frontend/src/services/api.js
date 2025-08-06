// API Configuration and Services
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't automatically logout on 401 errors
    // Let the AuthContext handle token validation and logout decisions
    // This prevents aggressive logouts during network issues or temporary server problems
    
    // Only auto-logout if it's a critical auth failure and we're not already on the login page
    if (error.response?.status === 401 && 
        error.config?.url?.includes('/auth/profile') &&
        !window.location.pathname.includes('/login')) {
      
      // Only clear tokens for profile endpoint failures (token validation)
      // This prevents logout loops during other API calls
      console.log('Profile verification failed, tokens may be invalid');
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  registerCandidate: (userData) => api.post('/auth/register/candidate', userData),
  registerCompany: (companyData) => api.post('/auth/register/company', companyData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
  logout: () => api.post('/auth/logout'),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJob: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getCompanyJobs: (params) => api.get('/jobs/company/my-jobs', { params }),
  getJobApplications: (jobId, params) => api.get(`/jobs/${jobId}/applications`, { params }),
  getCategories: () => api.get('/jobs/categories'),
};

// Applications API
export const applicationsAPI = {
  applyForJob: (jobId, formData) => {
    return api.post(`/applications/apply/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getMyApplications: (params) => api.get('/applications/my-applications', { params }),
  getCompanyApplications: (params) => api.get('/applications/company/all-applications', { params }),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, statusData) => api.put(`/applications/${id}/status`, statusData),
  addHRNote: (id, noteData) => api.post(`/applications/${id}/notes`, noteData),
  withdrawApplication: (id) => api.put(`/applications/${id}/withdraw`),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default api;