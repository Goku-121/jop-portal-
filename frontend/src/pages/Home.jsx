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
        setJobs(data.items || []);
      } catch (err) {
        console.log("Home fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container page-wrap">
      <div className="hero-pro text-center mb-4">
        <h1 className="fw-bold mb-2"> Welcome to Kaaj Kormo  </h1>
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
        <div className="text-center">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center">No jobs posted yet.</div>
      ) : (
        <div className="row">
          {jobs.map(job => (
            <div key={job._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5>{job.title || "Untitled Job"}</h5>
                  <p>{job.description?.slice(0, 100)}{job.description?.length > 100 ? "..." : ""}</p>
                  <p><strong>Location:</strong> {job.location || "N/A"}</p>
                  <p><strong>Salary:</strong> {job.salary || "Negotiable"}</p>
                  <Link to={`/jobs/${job._id}`} className="btn btn-primary w-100">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}