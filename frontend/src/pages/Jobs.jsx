import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs");
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading jobs...</p>;
  if (jobs.length === 0) return <p className="text-center mt-5">No jobs posted yet.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Latest Jobs</h2>
      <div className="row">
        {jobs.map(job => (
          <div className="col-md-6 mb-3" key={job._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description.substring(0, 100)}...</p>
                <p className="card-text">
                  <strong>Location:</strong> {job.location} <br />
                  <strong>Salary:</strong> {job.salary}
                </p>
                <Link to={`/jobs/${job._id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
