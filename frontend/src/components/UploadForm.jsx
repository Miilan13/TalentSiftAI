import React, { useState } from 'react';
import { uploadResume } from '../services/api';

const UploadForm = ({ job, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a resume file.');
      return;
    }
    
    setIsUploading(true);
    setMessage('Uploading and analyzing...');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const result = await uploadResume(job._id, formData);
      
      // NEW LINE: This will print the output to your browser's console
      console.log("✅ Success! Full response from backend:", result);

      setMessage('Analysis Complete!');
      setAnalysisResult(result.analysis);
      onUploadSuccess(); // Notify parent component
    } catch (error) {
      setMessage('Error: Could not process resume.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-form">
      <h2>Apply for: {job.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="resume">Upload Resume (PDF):</label>
          <input type="file" id="resume" onChange={handleFileChange} accept=".pdf,.docx" />
        </div>
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Analyzing...' : 'Upload and Analyze'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {analysisResult && (
        <div>
          <h3>Analysis Result:</h3>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadForm;