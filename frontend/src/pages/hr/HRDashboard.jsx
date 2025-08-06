import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { jobsAPI, applicationsAPI } from '../../services/api';
import CreateJobForm from '../../components/forms/CreateJobForm';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Plus,
  Search
} from 'lucide-react';

const HRDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [isCreateJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeJobs: 0,
    shortlistedCandidates: 0,
    interviewsToday: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'hr') {
      setLoading(false);
      return;
    }

    try {
      // Fetch jobs
      const jobsResponse = await jobsAPI.getCompanyJobs();
      if (jobsResponse.data && jobsResponse.data.success) {
        setJobs(jobsResponse.data.jobs || []);
      }

      // Fetch applications
      const applicationsResponse = await applicationsAPI.getCompanyApplications({ limit: 5 });
      if (applicationsResponse.data && applicationsResponse.data.success) {
        setRecentApplications(applicationsResponse.data.applications || []);
        
        // Update stats with real data
        setStats({
          totalApplications: applicationsResponse.data.stats?.total || 0,
          activeJobs: jobsResponse.data.jobs?.filter(job => job.status === 'active').length || 0,
          shortlistedCandidates: applicationsResponse.data.stats?.shortlisted || 0,
          interviewsToday: applicationsResponse.data.stats?.interviewed || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobCreated = (newJob) => {
    setJobs(prevJobs => [newJob, ...prevJobs]);
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      activeJobs: prevStats.activeJobs + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.name}! Manage your recruitment process effectively.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shortlistedCandidates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Interviews Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.interviewsToday}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Post New Job */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => setCreateJobModalOpen(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Search className="w-4 h-4 mr-2" />
                Browse Candidates
              </button>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
            {recentApplications.length > 0 ? (
              <div className="space-y-3">
                {recentApplications.slice(0, 3).map((application) => (
                  <div key={application._id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {application.user?.name || 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {application.job?.title || 'N/A'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                      application.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No recent applications</p>
            )}
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Interviews</h3>
            <p className="text-gray-500 text-sm">No upcoming interviews</p>
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Your Job Postings</h3>
              <button 
                onClick={() => setCreateJobModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading job postings...</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No job postings</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating your first job posting.</p>
                <div className="mt-6">
                  <button 
                    onClick={() => setCreateJobModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              job.status === 'active' ? 'bg-green-400' : 
                              job.status === 'draft' ? 'bg-yellow-400' : 'bg-gray-400'
                            }`}></span>
                            {job.status}
                          </span>
                          <span>{job.stats?.applications || 0} applications</span>
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {jobs.length > 5 && (
                  <div className="text-center pt-4">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View all {jobs.length} job postings →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <CreateJobForm 
        isOpen={isCreateJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        onJobCreated={handleJobCreated}
      />
    </div>
  );
};


export default HRDashboard;
