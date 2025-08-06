// In frontend/src/pages/JobsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jobsAPI } from '../services/api';
import JobApplicationModal from '../components/modals/JobApplicationModal';
import JobDetailsModal from '../components/modals/JobDetailsModal';
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Building2,
  Filter,
  Heart,
  ExternalLink,
  Briefcase,
  Users,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const JobsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    level: searchParams.get('level') || '',
    salary: searchParams.get('salary') || '',
    company: searchParams.get('company') || '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const salaryRanges = [
    '$30k - $50k',
    '$50k - $75k',
    '$75k - $100k',
    '$100k - $150k',
    '$150k+',
  ];

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchQuery && { search: searchQuery }),
        ...(location && { location }),
        ...(filters.type && { type: filters.type }),
        ...(filters.level && { level: filters.level }),
        ...(filters.salary && { salary: filters.salary }),
        ...(filters.company && { company: filters.company }),
      };

      const response = await jobsAPI.getJobs(params);

      if (response.data.success) {
        setJobs(response.data.jobs || []);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
        }));
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (err) {
      setError('An error occurred while fetching jobs');
      console.error('Fetch jobs error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, location, filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams();
    setPagination({ ...pagination, page: 1 });
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (location) params.set('location', location);
    if (filters.type) params.set('type', filters.type);
    if (filters.level) params.set('level', filters.level);
    if (filters.salary) params.set('salary', filters.salary);
    if (filters.company) params.set('company', filters.company);

    setSearchParams(params);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
    setPagination({ ...pagination, page: 1 });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      level: '',
      salary: '',
      company: '',
    });
    setSearchQuery('');
    setLocation('');
    setSearchParams(new URLSearchParams());
    setPagination({ ...pagination, page: 1 });
  };

  const toggleSaveJob = async (jobId) => {
    if (!isAuthenticated) return;

    try {
      if (savedJobs.has(jobId)) {
        await jobsAPI.unsaveJob(jobId);
        setSavedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await jobsAPI.saveJob(jobId);
        setSavedJobs((prev) => new Set([...prev, jobId]));
      }
    } catch (err) {
      console.error('Error saving/unsaving job:', err);
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleViewDetailsClick = (job) => {
    console.log('View details clicked for job:', job);
    setSelectedJobForDetails(job);
    setShowJobDetailsModal(true);
  };

  const handleApplyFromDetails = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSuccess = () => {
    // Refresh jobs list or show success message
    fetchJobs();
    // Could also show a success toast here
  };

  const formatSalary = (min, max, currency = 'INR') => {
    try {
      const format = (amount) => {
        if (!amount || isNaN(amount)) return '0';
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
        return amount.toString();
      };

      if (min && max) {
        return `${currency || 'INR'} ${format(min)} - ${format(max)}`;
      } else if (min) {
        return `${currency || 'INR'} ${format(min)}+`;
      }
      return 'Competitive';
    } catch (error) {
      console.error('Error formatting salary:', error, { min, max, currency });
      return 'Salary not specified';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer"
                onClick={() => handleViewDetailsClick(job)}>
              {job.title || 'Job Title'}
            </h3>
            <p className="text-gray-700">
              {(job.company && typeof job.company === 'object') ? 
                job.company.name : 
                (job.company || 'Company Name')
              }
            </p>
          </div>
        </div>

        {isAuthenticated && user?.role === 'candidate' && (
          <button
            onClick={() => toggleSaveJob(job._id)}
            className={`p-2 rounded-full transition-colors ${
              savedJobs.has(job._id)
                ? 'text-red-500 bg-red-100 hover:bg-red-200'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-100'
            }`}
          >
            <Heart className={`w-6 h-6 ${savedJobs.has(job._id) ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-800 line-clamp-3">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Array.isArray(job.requiredSkills) && job.requiredSkills.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        ))}
        {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            +{job.requiredSkills.length - 3} more
          </span>
        )}
        {(!job.requiredSkills || !Array.isArray(job.requiredSkills) || job.requiredSkills.length === 0) && (
          <span className="text-xs text-gray-500">
            No skills specified
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-500" />
          <span>
            {job.location?.remote ? 'Remote' : 
             (job.location && (job.location.city || job.location.state || job.location.country)) ?
               [job.location.city, job.location.state, job.location.country]
                 .filter(Boolean).join(', ') :
               'Location not specified'
            }
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-gray-500" />
          <span>{job.employmentType || job.type || 'Not specified'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-gray-500" />
          <span>
            {job.salary ? 
              formatSalary(job.salary.min, job.salary.max, job.salary.currency) : 
              'Salary not specified'
            }
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-700">
            {(job.applicants && Array.isArray(job.applicants)) ? 
              `${job.applicants.length} applicants` :
              '0 applicants'
            }
          </span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => handleViewDetailsClick(job)}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
          >
            View Details
          </button>
          {isAuthenticated && user?.role === 'candidate' && (
            <button
              onClick={() => handleApplyClick(job)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Search Header */}
      <div className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Find Your Dream Job</h1>
            <p className="text-gray-700 text-lg">
              Discover opportunities that match your skills and career goals.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <div className="lg:w-80">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span className="font-semibold">Filters</span>
              </button>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <select
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Salaries</option>
                    {salaryRanges.map((range) => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors font-semibold"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${pagination.total} jobs found`}
            </h2>
            {(searchQuery || location || Object.values(filters).some((f) => f)) && (
              <p className="text-gray-700 mt-1">
                {searchQuery && `for "${searchQuery}"`}
                {location && ` in ${location}`}
              </p>
            )}
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-700 text-lg">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Jobs</h3>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-14 h-14 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-700 mb-4">
              Try adjusting your search criteria or browse all available positions.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>

                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination({ ...pagination, page })}
                        className={`px-4 py-2 rounded-md transition-colors font-semibold ${
                          pagination.page === page
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        job={selectedJob}
        onSuccess={handleApplicationSuccess}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={showJobDetailsModal}
        onClose={() => setShowJobDetailsModal(false)}
        job={selectedJobForDetails}
        onApply={handleApplyFromDetails}
      />
    </div>
  );
};

export default JobsPage;

