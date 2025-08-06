// In src/components/JobList.jsx
import React from 'react';

const JobList = ({ jobs, onSelectJob }) => {
  return (
    <div className="job-list">
      {jobs.map((job) => (
        <div key={job._id} className="job-card">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <button onClick={() => onSelectJob(job)}>Apply Now</button>
        </div>
      ))}
    </div>
  );
};

export default JobList;