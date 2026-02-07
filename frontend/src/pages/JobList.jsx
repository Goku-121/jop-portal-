import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs"); // fetch all jobs
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading jobs...</p>;

  return (
    <div className="col-md-8 offset-md-2 mt-4">
      <h2 className="mb-3">Job Listings</h2>

      {jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{job.title}</h5>
              <p className="card-text">{job.description}</p>
              <p className="card-text">
                <small className="text-muted">
                  Location: {job.location} | Salary: {job.salary}
                </small>
              </p>
              {user?.role === "worker" && (
                <button className="btn btn-primary btn-sm">
                  Apply
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
