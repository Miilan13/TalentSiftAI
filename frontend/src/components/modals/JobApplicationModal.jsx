import React, { useState } from 'react';
import { X, Upload, FileText, DollarSign, Calendar, MapPin, User, Mail, Phone } from 'lucide-react';
import { applicationsAPI } from '../../services/api';

const JobApplicationModal = ({ isOpen, onClose, job, onSuccess }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availableFrom: '',
    noticePeriod: '',
    willingToRelocate: false,
    fullName: '',
    email: '',
    phone: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !job) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setResumeFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!resumeFile) {
        setError('Please upload your resume');
        setLoading(false);
        return;
      }

      if (!formData.coverLetter.trim()) {
        setError('Please write a cover letter');
        setLoading(false);
        return;
      }

      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setError('Please fill in all personal information fields');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const applicationData = new FormData();
      applicationData.append('resume', resumeFile);
      applicationData.append('coverLetter', formData.coverLetter);
      applicationData.append('expectedSalary', formData.expectedSalary);
      applicationData.append('availableFrom', formData.availableFrom);
      applicationData.append('noticePeriod', formData.noticePeriod);
      applicationData.append('willingToRelocate', formData.willingToRelocate);
      applicationData.append('fullName', formData.fullName);
      applicationData.append('email', formData.email);
      applicationData.append('phone', formData.phone);

      const response = await applicationsAPI.applyForJob(job._id, applicationData);
      
      if (response.data.success) {
        onSuccess && onSuccess();
        onClose();
        // Reset form
        setFormData({
          coverLetter: '',
          expectedSalary: '',
          availableFrom: '',
          noticePeriod: '',
          willingToRelocate: false,
          fullName: '',
          email: '',
          phone: '',
        });
        setResumeFile(null);
      }
    } catch (error) {
      console.error('Application error:', error);
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min, max, currency = 'INR') => {
    if (min && max) {
      return `${currency} ${min}k - ${max}k`;
    } else if (min) {
      return `${currency} ${min}k+`;
    }
    return 'Competitive';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900">Apply for Position</h3>
              <div className="mt-2">
                <h4 className="text-lg font-medium text-blue-600">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company?.name || 'Company'}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location?.remote ? 'Remote' : 
                     [job.location?.city, job.location?.state, job.location?.country]
                       .filter(Boolean).join(', ') || 'Location not specified'}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Expected Salary (per annum)
                </label>
                <input
                  type="text"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="e.g. 10 LPA"
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Resume/CV *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <div className="text-sm text-gray-600">
                  <label className="cursor-pointer text-blue-600 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="mt-1">PDF, DOC, DOCX up to 5MB</p>
                </div>
                {resumeFile && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ {resumeFile.name}
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                rows={6}
                className="input-field"
                placeholder="Tell us why you're the perfect fit for this role..."
                required
              />
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Available From
                </label>
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Period
                </label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  className="select-field"
                >
                  <option value="">Select notice period</option>
                  <option value="immediate">Immediate</option>
                  <option value="15-days">15 days</option>
                  <option value="1-month">1 month</option>
                  <option value="2-months">2 months</option>
                  <option value="3-months">3 months</option>
                </select>
              </div>
            </div>

            {/* Willing to Relocate */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="willingToRelocate"
                id="willingToRelocate"
                checked={formData.willingToRelocate}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="willingToRelocate" className="ml-2 text-sm text-gray-700">
                I am willing to relocate for this position
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationModal;
