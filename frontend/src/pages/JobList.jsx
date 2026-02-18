import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import "../css/JobList.css";
import { Link } from "react-router-dom";
export default function JobList() {
  const user = useSelector((s) => s.auth.user);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/jobs", {
        params: { q, location, page, limit },
      });

      setJobs(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setJobs([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, location, page, limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [q, location]);

  const handleResetFilters = () => {
    setQ("");
    setLocation("");
  };

return (
  <div className="container mt-4">
      {/* Header with title and filter controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">Jobs</h4>
          <small className="text-muted fs-6">
            {total > 0 ? `${total} jobs found` : "No jobs yet"} • Page {page}/{totalPages}
          </small>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Filter button - modern professional style */}
          <button
            className={`btn btn-outline-primary btn-icon-filter position-relative ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((prev) => !prev)}
            title={showFilters ? "Close filters" : "Open filters & search"}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          >
            <i className="bi bi-funnel"></i>

            {/* Badge showing if filters are active */}
            {(q || location) && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {q && location ? "2" : "1"}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter section */}
      {showFilters && (
        <div className="card filter-card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">Job title or keyword</label>
                <input
                  className="form-control"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. Driver, Electrician, Web Developer..."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium">Location</label>
                <input
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Chittagong, Gulshan, Remote..."
                />
              </div>
            </div>

            <button
              className="btn btn-outline-secondary mt-3 px-4"
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading available jobs...</p>
        </div>
      )}

      {/* No jobs found */}
      {!loading && jobs.length === 0 && (
        <div className="alert alert-info text-center my-5 py-4">
          No jobs found matching your criteria.
        </div>
      )}

      {/* Job list */}
      {!loading &&
        jobs.map((job) => (
          <div key={job._id} className="card job-card mb-3 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-2 fw-semibold">{job.title}</h5>

              <div className="job-meta text-muted mb-3 d-flex flex-wrap gap-3">
                <span>📍 {job.location || "Not specified"}</span>
                <span>•</span>
                <span>💰 {job.salary || "Negotiable"}</span>
              </div>

              <p className="card-text text-secondary mb-3">
                {(job.description || "").slice(0, 160)}
                {(job.description || "").length > 160 ? "..." : ""}
              </p>

              {user?.role === "worker" ? (
                <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm px-4">
                  Apply Now
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline-secondary btn-sm px-4">
                  Login to Apply
                </Link>
              )}
            </div>
          </div>
        ))}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination-wrapper d-flex justify-content-between align-items-center mt-5 mb-5">
          <button
            className="btn btn-outline-primary pagination-btn prev"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <i className="bi bi-chevron-left me-1"></i> Prev
          </button>

          <span className="page-info text-muted">
            Page <strong className="text-dark">{page}</strong> of{" "}
            <strong className="text-dark">{totalPages}</strong>
          </span>

          <button
            className="btn btn-outline-primary pagination-btn next"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  );
}