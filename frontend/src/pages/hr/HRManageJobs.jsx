import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { jobsAPI } from "../../services/api";
import CreateJobForm from "../../components/forms/CreateJobForm";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Users,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";

const HRManageJobs = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch jobs from API
  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, skipping job fetch");
      setLoading(false);
      return;
    }

    if (user.role !== "hr") {
      console.log("User is not HR, role:", user.role);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching jobs from API...");
      console.log("Current user:", user);
      console.log("Auth token:", localStorage.getItem("token"));

      const response = await jobsAPI.getCompanyJobs();
      console.log("Full API response:", response);
      console.log("Response data:", response.data);

      if (response.data && response.data.success) {
        console.log("Jobs received:", response.data.jobs);
        console.log("Total jobs count:", response.data.total);
        setJobs(response.data.jobs || []);
      } else {
        console.error("API returned success: false or no data");
        console.error("Response structure:", response);
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      console.error("Error message:", error.message);
      // Don't fallback to mock data - show empty state instead
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobCreated = (newJob) => {
    // Optimistically add the new job to the list
    setJobs((prev) => [newJob, ...prev]);
    setShowCreateModal(false);
    // Refresh the job list after a brief delay to get the complete data from server
    setTimeout(() => {
      fetchJobs();
    }, 1000);
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "active":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "draft":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "closed":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "paused":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location.city || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Salary not specified";
    if (salary.min && salary.max) {
      return `${
        salary.currency || "USD"
      } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
    }
    if (salary.min) {
      return `${salary.currency || "USD"} ${salary.min.toLocaleString()}+`;
    }
    if (salary.max) {
      return `Up to ${salary.currency || "USD"} ${salary.max.toLocaleString()}`;
    }
    return "Salary not specified";
  };

  const formatLocation = (location) => {
    if (!location) return "Location not specified";
    if (location.remote) return "Remote";
    return (
      [location.city, location.state, location.country]
        .filter(Boolean)
        .join(", ") || "Location not specified"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your job postings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="mt-2 text-gray-600">
              Create, edit, and manage your job postings
            </p>
            <div className="mt-1 text-xs text-gray-500">
              User: {user?.name || "Unknown"} | Role: {user?.role || "Unknown"}{" "}
              | Authenticated: {isAuthenticated ? "Yes" : "No"}
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Post New Job</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.filter((job) => job.status === "active").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Applications
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.reduce(
                    (total, job) => total + (job.stats?.applicants || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Draft Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobs.filter((job) => job.status === "draft").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="select-field min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your job postings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No jobs found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {jobs.length === 0
                  ? "Get started by creating your first job posting."
                  : "No jobs match your current filters."}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Total jobs in database: {jobs.length}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Post Your First Job</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <div key={job._id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {job.title}
                          </h3>
                          <span
                            className={`ml-3 ${getStatusBadge(job.status)}`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button className="p-1 text-blue-600 hover:text-blue-900 transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-900 transition-colors">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-900 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {formatLocation(job.location)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">
                            {formatSalary(job.salary)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>{job.stats?.applicants || 0} applications</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span>
                            Posted{" "}
                            {new Date(job.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(job.requiredSkills || job.skills || [])
                          .slice(0, 3)
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        {(job.requiredSkills || job.skills || []).length >
                          3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +
                            {(job.requiredSkills || job.skills || []).length -
                              3}{" "}
                            more
                          </span>
                        )}
                        {(!job.requiredSkills && !job.skills) ||
                          ((job.requiredSkills || job.skills || []).length ===
                            0 && (
                            <span className="text-xs text-gray-500">
                              No skills specified
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Job Modal */}
        <CreateJobForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onJobCreated={handleJobCreated}
        />
      </div>
    </div>
  );
};

export default HRManageJobs;
