// Candidate Dashboard Component
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { jobsAPI, applicationsAPI, authAPI } from '../../services/api';
import { 
  User, 
  Briefcase, 
  FileText,
  TrendingUp,
  Bell,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Download,
  Edit,
  Plus
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    interviewsScheduled: 0,
    profileViews: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [suggestedJobs, setSuggestedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState({
    percentage: 0,
    completedItems: [],
    missingItems: []
  });
  const [loading, setLoading] = useState(true);

  const calculateProfileCompletion = useCallback((userData) => {
    const requirements = [
      { key: 'name', label: 'Basic Profile Info', check: () => userData?.name },
      { key: 'phone', label: 'Phone Number', check: () => userData?.phone },
      { key: 'skills', label: 'Skills Added', check: () => userData?.skills && userData.skills.length > 0 },
      { key: 'experience', label: 'Experience Details', check: () => userData?.experience && userData.experience.length > 0 },
      { key: 'location', label: 'Location Details', check: () => userData?.location && (userData.location.city || userData.location.state) },
      { key: 'resume', label: 'Resume Uploaded', check: () => userData?.resume && userData.resume.filename }
    ];

    const completedItems = requirements.filter(req => req.check());
    const missingItems = requirements.filter(req => !req.check());
    const percentage = Math.round((completedItems.length / requirements.length) * 100);

    return {
      percentage,
      completedItems: completedItems.map(item => item.label),
      missingItems: missingItems.map(item => item.label)
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user profile for completion calculation
      const userResponse = await authAPI.getProfile();
      const userData = userResponse.data.user;
      
      // Calculate profile completion
      const completion = calculateProfileCompletion(userData);
      setProfileCompletion(completion);
      
      // Fetch applications
      const applicationsResponse = await applicationsAPI.getMyApplications();
      const applications = applicationsResponse.data.applications || [];
      setRecentApplications(applications.slice(0, 5));
      
      // Calculate stats from actual data
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'applied' || app.status === 'pending').length,
        interviewsScheduled: applications.filter(app => app.status === 'interview').length,
        profileViews: userData?.profileViews || 0 // Use real data or 0
      });

      // Fetch suggested jobs
      const jobsResponse = await jobsAPI.getJobs({ limit: 6 });
      setSuggestedJobs(jobsResponse.data.jobs || []);

      // Generate notifications based on real application data
      const recentNotifications = applications
        .slice(0, 3)
        .map(app => ({
          id: app._id,
          type: 'application_update',
          title: 'Application Status Update',
          message: `Your application for ${app.job?.title} is ${app.status}`,
          time: formatTimeAgo(app.createdAt),
          read: false
        }));

      // Add a job match notification if there are suggested jobs
      if (jobsResponse.data.jobs && jobsResponse.data.jobs.length > 0) {
        recentNotifications.push({
          id: 'job_match',
          type: 'new_job',
          title: 'New Job Matches',
          message: `We found ${jobsResponse.data.jobs.length} new jobs that match your profile`,
          time: 'Today',
          read: false
        });
      }

      setNotifications(recentNotifications);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateProfileCompletion]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) return 'Just now';
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getApplicationStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'reviewing':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'interview':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-green-100 text-green-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_update':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'new_job':
        return <Briefcase className="w-4 h-4 text-green-500" />;
      case 'interview':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your job search
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.interviewsScheduled}</p>
                <p className="text-sm text-gray-600">Interviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                <p className="text-sm text-gray-600">Profile Views</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Applications */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                  <Link
                    to="/candidate/applications"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                {recentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <Briefcase className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{application.job?.title}</h3>
                            <p className="text-sm text-gray-600">{application.job?.company}</p>
                            <p className="text-xs text-gray-500">Applied {new Date(application.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getApplicationStatusIcon(application.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getApplicationStatusColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No applications yet</p>
                    <Link
                      to="/jobs"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Job Recommendations */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recommended Jobs</h2>
                  <Link
                    to="/jobs"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View All
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {suggestedJobs.slice(0, 3).map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{job.company?.name || 'Company Name'}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location?.remote ? 'Remote' : 
                               [job.location?.city, job.location?.state, job.location?.country]
                                 .filter(Boolean).join(', ') || 'Location not specified'}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              {job.salary?.min && job.salary?.max 
                                ? `${job.salary.currency || 'INR'} ${job.salary.min}k - ${job.salary.max}k` 
                                : 'Salary not specified'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">95% match</span>
                            </div>
                            <Link
                              to={`/jobs/${job._id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-gray-900">{profileCompletion.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${profileCompletion.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3">
                {profileCompletion.completedItems.map((item, index) => (
                  <div key={`completed-${index}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item}</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                ))}
                {profileCompletion.missingItems.map((item, index) => (
                  <div key={`missing-${index}`} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item}</span>
                    <XCircle className="w-4 h-4 text-red-500" />
                  </div>
                ))}
              </div>
              <Link
                to="/candidate/profile"
                className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Complete Profile</span>
              </Link>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        notification.read ? 'bg-gray-50' : 'bg-blue-50'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/jobs"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Browse Jobs</span>
                </Link>
                <Link
                  to="/candidate/profile"
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Update Profile</span>
                </Link>
                <Link
                  to="/candidate/applications"
                  className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Applications</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
