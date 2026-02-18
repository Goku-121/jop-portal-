import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../css/Home.css";
export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
      const { data } = await api.get("/jobs", { params: { limit: 6, page: 1 } });
setJobs(data.items || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="container mt-5">
      {/* Hero Section */}
  <div className="hero-section text-center">
  <h1>Welcome to Bangla Skill Jobs</h1>
  <p className="lead">Find jobs or hire skilled workers easily!</p>
  <Link to="/jobs" className="btn btn-primary">
    Browse Jobs
  </Link>
</div>
      

      {/* Featured Jobs */}
      <h3 className="mb-3">Latest Jobs</h3>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="row">
          {jobs.map((job) => (
            <div key={job._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <p className="card-text">{job.description.slice(0, 100)}...</p>
                  <p className="mb-1"><strong>Location:</strong> {job.location}</p>
                  <p><strong>Salary:</strong> {job.salary}</p>
                  <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-primary">
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
