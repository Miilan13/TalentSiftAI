import React from 'react';
import AIResumeAnalyzer from '../components/ai/AIResumeAnalyzer';

const AIAnalysisPage = () => {
  const handleAnalysisComplete = (analysis) => {
    console.log('Resume analysis completed:', analysis);
    // You can add additional logic here, like saving to database
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Resume Analysis Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Upload candidate resumes and let our AI extract structured information including 
            personal details, skills, experience, education, and more.
          </p>
        </div>

        {/* AI Analyzer Component */}
        <AIResumeAnalyzer onAnalysisComplete={handleAnalysisComplete} />

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Extraction</h3>
            <p className="text-gray-600">
              Extract personal information, contact details, and professional links automatically
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills Analysis</h3>
            <p className="text-gray-600">
              Identify technical skills, programming languages, and tools mentioned in resumes
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Work History</h3>
            <p className="text-gray-600">
              Parse work experience, company names, and professional background
            </p>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported Formats</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PDF documents (.pdf)</li>
                <li>• Microsoft Word (.docx)</li>
                <li>• File size limit: 10MB</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">AI Technology</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Advanced NLP using spaCy</li>
                <li>• Named Entity Recognition</li>
                <li>• Pattern matching and extraction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPage;
