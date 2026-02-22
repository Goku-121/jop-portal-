import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs", { params: { limit: 6, page: 1 } });
        console.log("Home - API Full Response:", data); 
        console.log("Home - Items received:", data.items); 

        const jobList = data.items || [];
        setJobs(jobList);
      } catch (err) {
        console.error("Home - Fetch error:", err.message, err.response?.data);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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

      {loading ? (
        <div className="card card-pro p-4 text-center">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted2 mb-0">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
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

      
      <pre style={{ background: "#f8f9fa", padding: "10px", borderRadius: "8px" }}>
        {JSON.stringify(jobs, null, 2)}
      </pre>
    </div>
  );
}