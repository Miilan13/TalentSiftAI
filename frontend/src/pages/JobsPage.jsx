// Jobs Page Component
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jobsAPI } from '../services/api';
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
  AlertCircle
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
    company: searchParams.get('company') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
  const salaryRanges = [
    '$30k - $50k',
    '$50k - $75k', 
    '$75k - $100k',
    '$100k - $150k',
    '$150k+'
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
        ...(filters.company && { company: filters.company })
      };

      const response = await jobsAPI.getJobs(params);
      
      if (response.success) {
        setJobs(response.data.jobs);
        setPagination(prev => ({
          ...prev,
          total: response.data.total,
          totalPages: response.data.totalPages
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
      [filterType]: value
    });
    setPagination({ ...pagination, page: 1 });
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      level: '',
      salary: '',
      company: ''
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
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      } else {
        await jobsAPI.saveJob(jobId);
        setSavedJobs(prev => new Set([...prev, jobId]));
      }
    } catch (err) {
      console.error('Error saving/unsaving job:', err);
    }
  };

  const formatSalary = (min, max) => {
    const format = (amount) => {
      if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `${(amount / 1000).toFixed(0)}k`;
      return amount.toString();
    };
    
    if (min && max) {
      return `$${format(min)} - $${format(max)}`;
    } else if (min) {
      return `$${format(min)}+`;
    }
    return 'Competitive';
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
              <Link to={`/jobs/${job._id}`}>{job.title}</Link>
            </h3>
            <p className="text-gray-600">{job.company?.name || 'Company Name'}</p>
          </div>
        </div>
        
        {isAuthenticated && user?.role === 'candidate' && (
          <button
            onClick={() => toggleSaveJob(job._id)}
            className={`p-2 rounded-full transition-colors ${
              savedJobs.has(job._id)
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${savedJobs.has(job._id) ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-700 line-clamp-3">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.requirements?.slice(0, 3).map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
        {job.requirements?.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            +{job.requirements.length - 3} more
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>{formatSalary(job.salary?.min, job.salary?.max)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(job.createdAt)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {job.applicants?.length || 0} applicants
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/jobs/${job._id}`}
            className="px-4 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
          >
            View Details
          </Link>
          {isAuthenticated && user?.role === 'candidate' && (
            <Link
              to={`/jobs/${job._id}/apply`}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job</h1>
            <p className="text-gray-600">
              Discover opportunities that match your skills and career goals
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="lg:w-80">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Search Jobs
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <select
                    value={filters.salary}
                    onChange={(e) => handleFilterChange('salary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
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
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Loading...' : `${pagination.total} jobs found`}
            </h2>
            {(searchQuery || location || Object.values(filters).some(f => f)) && (
              <p className="text-gray-600 mt-1">
                {searchQuery && `for "${searchQuery}"`}
                {location && ` in ${location}`}
              </p>
            )}
          </div>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Jobs</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchJobs}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all available positions.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
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
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination({ ...pagination, page })}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          pagination.page === page
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
