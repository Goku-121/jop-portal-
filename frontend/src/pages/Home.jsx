import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/jobs", { params: { limit: 6, page: 1 } });
        console.log("Home - Full API Response:", data);
        console.log("Home - Items:", data.items);
        setJobs(data.items || []);
      } catch (err) {
        console.error("Home - Fetch error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
        });
        setError(err.message || "Failed to load jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="container page-wrap text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading latest jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-wrap text-center mt-5 text-danger">
        <h4>Error: {error}</h4>
        <p>Please check your connection or try again later.</p>
      </div>
    );
  }

  return (
    <div className="container page-wrap">
      <div className="hero-pro text-center mb-4">
        <h1 className="fw-bold mb-2">Welcome to Bangla Job Portal</h1>
        <p className="mb-3 opacity-75">Find jobs or hire skilled workers easily!</p>
        <Link to="/jobs" className="btn btn-light px-4 fw-bold">
          <i className="fa-solid fa-magnifying-glass me-2"></i>
          Browse Jobs
        </Link>
      </div>

      <h3 className="mb-3 section-title">
        <i className="fa-solid fa-bolt me-2 text-primary"></i>Latest Jobs
      </h3>

      {jobs.length === 0 ? (
        <div className="card card-pro p-4 text-center">
          <p className="mb-0 text-muted2">No jobs posted yet.</p>
        </div>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div key={job._id} className="col-md-4 mb-4">
              <div className="card job-card-pro h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{job.title || "Untitled Job"}</h5>
                  <p className="text-muted2 mb-3">
                    {(job.description || "").slice(0, 100)}
                    {(job.description || "").length > 100 ? "..." : ""}
                  </p>

                  <p className="mb-1">
                    <i className="fa-solid fa-location-dot me-2 text-primary"></i>
                    <strong>Location:</strong> {job.location || "N/A"}
                  </p>
                  <p className="mb-3">
                    <i className="fa-solid fa-sack-dollar me-2 text-primary"></i>
                    <strong>Salary:</strong> {job.salary || "Negotiable"}
                  </p>

                  <Link to={`/jobs/${job._id}`} className="btn btn-pro w-100">
                    <i className="fa-solid fa-eye me-2"></i>View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      
      <pre style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginTop: "30px" }}>
        {JSON.stringify({ jobsLoaded: jobs.length, sampleJob: jobs[0] || "No data" }, null, 2)}
      </pre>
    </div>
  );
}