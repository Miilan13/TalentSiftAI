import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react';

const HRApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');

  // Mock data - replace with API call
  useEffect(() => {
    const mockApplications = [
      {
        id: 1,
        candidateName: 'John Smith',
        candidateEmail: 'john.smith@email.com',
        candidatePhone: '+1 (555) 123-4567',
        candidateLocation: 'New York, NY',
        jobTitle: 'Senior Frontend Developer',
        appliedDate: '2025-08-01',
        status: 'pending',
        experience: 5,
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS'],
        resumeUrl: '#',
        rating: 0
      },
      {
        id: 2,
        candidateName: 'Sarah Johnson',
        candidateEmail: 'sarah.johnson@email.com',
        candidatePhone: '+1 (555) 234-5678',
        candidateLocation: 'San Francisco, CA',
        jobTitle: 'Backend Engineer',
        appliedDate: '2025-07-30',
        status: 'interview',
        experience: 3,
        skills: ['Node.js', 'Python', 'MongoDB', 'AWS'],
        resumeUrl: '#',
        rating: 4
      },
      {
        id: 3,
        candidateName: 'Mike Davis',
        candidateEmail: 'mike.davis@email.com',
        candidatePhone: '+1 (555) 345-6789',
        candidateLocation: 'Austin, TX',
        jobTitle: 'UI/UX Designer',
        appliedDate: '2025-07-28',
        status: 'shortlisted',
        experience: 4,
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        resumeUrl: '#',
        rating: 5
      },
      {
        id: 4,
        candidateName: 'Lisa Chen',
        candidateEmail: 'lisa.chen@email.com',
        candidatePhone: '+1 (555) 456-7890',
        candidateLocation: 'Seattle, WA',
        jobTitle: 'Senior Frontend Developer',
        appliedDate: '2025-07-25',
        status: 'rejected',
        experience: 2,
        skills: ['React', 'Vue.js', 'CSS', 'HTML'],
        resumeUrl: '#',
        rating: 2
      }
    ];
    
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'interview':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'shortlisted':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'hired':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'interview':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'hired':
        return <Star className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const uniqueJobs = [...new Set(applications.map(app => app.jobTitle))];
  
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesJob = jobFilter === 'all' || app.jobTitle === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="mt-2 text-gray-600">
            Review and manage candidate applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Interviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'interview').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'shortlisted').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Hired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {applications.filter(app => app.status === 'hired').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select-field min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
                <select
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="select-field min-w-[180px]"
                >
                  <option value="all">All Jobs</option>
                  {uniqueJobs.map((job, index) => (
                    <option key={index} value={job}>{job}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No applications match your current filters.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <li key={application.id}>
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(application.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{application.candidateName}</h3>
                              <p className="text-sm text-gray-600">{application.jobTitle}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={getStatusBadge(application.status)}>
                                {application.status}
                              </span>
                              {application.rating > 0 && (
                                <div className="flex items-center">
                                  {renderStars(application.rating)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {application.candidateEmail}
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {application.candidatePhone}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {application.candidateLocation}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {application.experience} years exp.
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {application.skills.slice(0, 4).map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                            {application.skills.length > 4 && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{application.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          title="Download Resume"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRApplications;
