import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Users, 
  Edit2, 
  Save,
  X,
  Camera,
  Calendar,
  Briefcase,
  Award
} from 'lucide-react';

const HRCompanyProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: user?.company?.name || 'TechCorp Inc',
    email: user?.company?.email || 'contact@techcorp.com',
    phone: user?.company?.phone || '+1 (555) 123-4567',
    website: user?.company?.website || 'https://techcorp.com',
    description: user?.company?.description || 'Leading technology company focused on innovative solutions.',
    industry: user?.company?.industry || 'Technology',
    size: user?.company?.size || '51-200',
    location: user?.company?.location || 'New York, NY',
    founded: user?.company?.founded || '2010',
    benefits: user?.company?.benefits || ['Health Insurance', 'Remote Work', '401k Match', 'Flexible Hours']
  });

  const handleInputChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // API call to update company profile
      console.log('Saving company data:', companyData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating company profile:', error);
    }
  };

  const handleCancel = () => {
    setCompanyData({
      name: user?.company?.name || 'TechCorp Inc',
      email: user?.company?.email || 'contact@techcorp.com',
      phone: user?.company?.phone || '+1 (555) 123-4567',
      website: user?.company?.website || 'https://techcorp.com',
      description: user?.company?.description || 'Leading technology company focused on innovative solutions.',
      industry: user?.company?.industry || 'Technology',
      size: user?.company?.size || '51-200',
      location: user?.company?.location || 'New York, NY',
      founded: user?.company?.founded || '2010',
      benefits: user?.company?.benefits || ['Health Insurance', 'Remote Work', '401k Match', 'Flexible Hours']
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
            <p className="mt-2 text-gray-600">
              Manage your company information and branding
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="btn-success flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-8 text-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary-600 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-12 h-12" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg transform translate-x-8 translate-y-2">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{companyData.name}</h2>
                <p className="text-gray-600">{companyData.industry}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="text-sm">{companyData.email}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{companyData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm">{companyData.website}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{companyData.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white shadow rounded-lg mt-6 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Company Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Company Size</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{companyData.size} employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Founded</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{companyData.founded}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Active Jobs</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">3 positions</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Total Hires</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">45 candidates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Company Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={companyData.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{companyData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  {isEditing ? (
                    <select
                      name="industry"
                      value={companyData.industry}
                      onChange={handleInputChange}
                      className="select-field"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{companyData.industry}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={companyData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{companyData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={companyData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{companyData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={companyData.website}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">
                      <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                        {companyData.website}
                      </a>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={companyData.location}
                      onChange={handleInputChange}
                      placeholder="City, State"
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{companyData.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  {isEditing ? (
                    <select
                      name="size"
                      value={companyData.size}
                      onChange={handleInputChange}
                      className="select-field"
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{companyData.size} employees</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="founded"
                      value={companyData.founded}
                      onChange={handleInputChange}
                      min="1800"
                      max="2025"
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{companyData.founded}</p>
                  )}
                </div>
              </div>

              {/* Company Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={companyData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe your company, mission, and values..."
                    className="textarea-field"
                  />
                ) : (
                  <p className="text-gray-900">{companyData.description}</p>
                )}
              </div>

              {/* Benefits */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Benefits
                </label>
                <div className="flex flex-wrap gap-2">
                  {companyData.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-2">
                    Benefit editing functionality will be added here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRCompanyProfile;
