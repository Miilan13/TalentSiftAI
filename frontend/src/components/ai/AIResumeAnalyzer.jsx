import React, { useState } from 'react';
import { Upload, Brain, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AI_SERVICE_URL = 'http://localhost:8000/analyze/';

const AIResumeAnalyzer = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
        setAnalysis(null);
      } else {
        setError('Please select a PDF or DOCX file');
      }
    }
  };

  const analyzeResume = async () => {
    if (!file) return;

    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(AI_SERVICE_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`AI Service Error: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('Resume analysis error:', err);
      setError(`Analysis failed: ${err.message}. Please ensure the AI service is running on localhost:8000`);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalysis(null);
    setError(null);
  };

  const renderAnalysisResult = () => {
    if (!analysis) return null;

    const { analysis: data } = analysis;

    return (
      <div className="mt-6 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-green-800">Analysis Complete</h3>
          </div>
          <p className="mt-1 text-sm text-green-700">
            Resume analyzed successfully! Here's what our AI found:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Personal Information */}
          {data.candidate_personal_info && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Personal Information
              </h4>
              <div className="space-y-1 text-sm">
                {data.candidate_personal_info.full_name && (
                  <p><strong>Name:</strong> {data.candidate_personal_info.full_name}</p>
                )}
                {data.candidate_personal_info.email && (
                  <p><strong>Email:</strong> {data.candidate_personal_info.email}</p>
                )}
                {data.candidate_personal_info.phone_number && (
                  <p><strong>Phone:</strong> {data.candidate_personal_info.phone_number}</p>
                )}
                {data.candidate_personal_info.location && (
                  <p><strong>Location:</strong> {data.candidate_personal_info.location}</p>
                )}
                {data.candidate_personal_info.linkedin_url && (
                  <p><strong>LinkedIn:</strong> <a href={data.candidate_personal_info.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profile</a></p>
                )}
                {data.candidate_personal_info.github_url && (
                  <p><strong>GitHub:</strong> <a href={data.candidate_personal_info.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profile</a></p>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {data.work_experience && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-2">Work Experience</h4>
              {data.work_experience.job_roles_and_companies && data.work_experience.job_roles_and_companies.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">Roles & Companies:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {data.work_experience.job_roles_and_companies.map((role, index) => (
                      <li key={index}>{role}</li>
                    ))}
                  </ul>
                </div>
              )}
              {data.work_experience.all_companies_mentioned && data.work_experience.all_companies_mentioned.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Companies Mentioned:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.work_experience.all_companies_mentioned.map((company, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {data.education.map((edu, index) => (
                  <li key={index} className="border-l-2 border-blue-200 pl-3">
                    {edu.degree_info}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Sections */}
          {data.summary && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-2">Summary</h4>
              <p className="text-sm text-gray-600">{data.summary}</p>
            </div>
          )}

          {data.projects && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-2">Projects</h4>
              <p className="text-sm text-gray-600">{data.projects}</p>
            </div>
          )}

          {data.certifications && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 md:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-2">Certifications</h4>
              <p className="text-sm text-gray-600">{data.certifications}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-4">
          <button
            onClick={resetAnalysis}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Analyze Another Resume
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Brain className="w-6 h-6 mr-2" />
            AI Resume Analyzer
          </h2>
          <p className="text-primary-100 mt-1">
            Upload a resume to extract and analyze candidate information using AI
          </p>
        </div>

        <div className="p-6">
          {!analysis && (
            <>
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={analyzing}
                />
                
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-600" />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop your resume here, or click to browse
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Supports PDF and DOCX files up to 10MB
                    </p>
                  </div>

                  {file && (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 inline-flex items-center">
                      <FileText className="w-4 h-4 text-gray-600 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Analyze Button */}
              {file && !analyzing && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={analyzeResume}
                    className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Resume with AI
                  </button>
                </div>
              )}

              {/* Analyzing State */}
              {analyzing && (
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-600 mr-2" />
                    <span className="text-gray-600">Analyzing resume...</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Our AI is extracting and analyzing the candidate information
                  </p>
                </div>
              )}
            </>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
              </div>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button
                  onClick={resetAnalysis}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Analysis Results */}
          {renderAnalysisResult()}
        </div>

        {/* AI Service Status */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Powered by TalentSift AI Service</span>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
              <span>AI Service: Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIResumeAnalyzer;
