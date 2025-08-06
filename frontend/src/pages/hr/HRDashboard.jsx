import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  Plus,
  Search
} from 'lucide-react';

const HRDashboard = () => {
  const { user } = useAuth();
  const [stats] = useState({
    totalApplications: 0,
    activeJobs: 0,
    shortlistedCandidates: 0,
    interviewsToday: 0
  });

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
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
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
            <p className="text-gray-500 text-sm">No recent applications</p>
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
              <button className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No job postings</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first job posting.</p>
              <div className="mt-6">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
