import React from 'react';
import { X, MapPin, DollarSign, Calendar, Clock, Building2, Users, Briefcase, Eye } from 'lucide-react';

const JobDetailsModal = ({ isOpen, onClose, job, onApply }) => {
  if (!isOpen) return null;
  
  if (!job) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The job details could not be loaded.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('JobDetailsModal job object:', job);
  console.log('Job salary:', job.salary);
  console.log('Job experienceYears:', job.experienceYears);
  console.log('Job requirements:', job.requirements);
  console.log('Job qualifications:', job.qualifications);

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
      console.error('Error formatting salary in modal:', error, { min, max, currency });
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title || 'Job Title'}</h2>
              <p className="text-gray-600">
                {(job.company && typeof job.company === 'object') ? 
                  (job.company.name || 'Company Name') : 
                  (job.company || 'Company Name')
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Job Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Location</span>
              </div>
              <p className="mt-1 text-gray-900">
                {job.location?.remote ? 'Remote' : 
                 (job.location && (job.location.city || job.location.state || job.location.country)) ?
                   [job.location.city, job.location.state, job.location.country]
                     .filter(Boolean).join(', ') :
                   'Location not specified'
                }
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600">
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Salary</span>
              </div>
              <p className="mt-1 text-gray-900">
                {job.salary ? 
                  formatSalary(job.salary.min, job.salary.max, job.salary.currency) : 
                  'Salary not specified'
                }
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600">
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Type</span>
              </div>
              <p className="mt-1 text-gray-900">{job.employmentType || job.type || 'Not specified'}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Posted</span>
              </div>
              <p className="mt-1 text-gray-900">{formatDate(job.createdAt)}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Required Skills */}
          {Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience & Qualifications */}
          {(job.experienceYears || job.qualifications || job.requirements) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
              <div className="space-y-2 text-gray-700">
                {job.experienceYears && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>
                      {typeof job.experienceYears === 'object' && job.experienceYears.min ? 
                        `${job.experienceYears.min}${job.experienceYears.max ? `-${job.experienceYears.max}` : '+'} years of experience required` :
                        `${job.experienceYears} years of experience required`
                      }
                    </span>
                  </div>
                )}
                {job.requirements && (
                  <div className="mt-2">
                    <p className="whitespace-pre-wrap">
                      {typeof job.requirements === 'object' ? 
                        (Array.isArray(job.requirements) ? 
                          job.requirements.join(', ') : 
                          JSON.stringify(job.requirements)
                        ) : 
                        job.requirements
                      }
                    </p>
                  </div>
                )}
                {job.qualifications && (
                  <div className="mt-2">
                    <p className="whitespace-pre-wrap">
                      {typeof job.qualifications === 'object' ? 
                        JSON.stringify(job.qualifications) : 
                        job.qualifications
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Company Info */}
          {job.company && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {(typeof job.company === 'object' && job.company.name) || 
                       job.company || 'Company Name'}
                    </h4>
                    {(typeof job.company === 'object' && job.company.industry) && (
                      <p className="text-sm text-gray-600">{job.company.industry}</p>
                    )}
                  </div>
                </div>
                {(typeof job.company === 'object' && job.company.description) && (
                  <p className="text-gray-700 text-sm mt-2">{job.company.description}</p>
                )}
              </div>
            </div>
          )}

          {/* Application Stats */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900 font-medium">
                  {(job.applicants && Array.isArray(job.applicants)) ? 
                    `${job.applicants.length} applicants` : 
                    '0 applicants'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-blue-900 font-medium">
                  {(job.stats && typeof job.stats === 'object' && job.stats.views) || 0} views
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-xl">
          <div className="text-sm text-gray-600">
            Job ID: {job._id?.slice(-6) || 'N/A'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            {onApply && (
              <button
                onClick={() => {
                  onApply(job);
                  onClose();
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;
