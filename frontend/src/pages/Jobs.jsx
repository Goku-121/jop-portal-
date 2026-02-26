import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../css/Jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // ✅ If your API returns {items: []} use that
        // ✅ If your API returns [] directly, fallback to data
        const { data } = await api.get("/jobs", { params: { limit: 30, page: 1 } });

        const items = Array.isArray(data) ? data : (data.items || []);
        setJobs(items);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [jobs]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return jobs.filter((job) => {
      const okQ =
        !query ||
        (job.title || "").toLowerCase().includes(query) ||
        (job.description || "").toLowerCase().includes(query);

      const okLoc = location === "all" || (job.location || "") === location;
      return okQ && okLoc;
    });
  }, [jobs, q, location]);

  return (
    <div className="container my-4">
      {/* ✅ Page Hero */}
      <div className="jobs-hero mb-4">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <h2 className="fw-bold mb-1">Find Jobs in Bangladesh</h2>
            <p className="mb-0 opacity-75">Search by title, skill, or location.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-light fw-bold" to="/register">
              <i className="fa-solid fa-user-plus me-2"></i>
              Create Account
            </Link>
            <Link className="btn btn-outline-light fw-bold" to="/login">
              <i className="fa-solid fa-right-to-bracket me-2"></i>
              Login
            </Link>
          </div>
        </div>

        {/* ✅ Search / Filter */}
        <div className="row g-2 mt-3">
          <div className="col-12 col-md-8">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>
              <input
                className="form-control"
                placeholder="Search jobs (Driver, Cleaner, Electrician...)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <select
              className="form-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "all" ? "All Locations" : loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ✅ Title row */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="m-0 fw-bold">
          <i className="fa-solid fa-bolt me-2 text-primary"></i>
          Latest Jobs
        </h4>
        <div className="text-muted small">
          Showing <b>{filtered.length}</b> jobs
        </div>
      </div>

      {/* ✅ Content */}
      {loading ? (
        <div className="text-center py-5">Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">No jobs found.</div>
      ) : (
        <div className="row g-4">
          {filtered.map((job) => (
            <div className="col-12 col-md-6 col-lg-4" key={job._id}>
              <div className="card h-100 shadow-sm job-card">
                <img
                  src={job.imageUrl || "/images/jobs/default.jpg"}
                  className="card-img-top job-img"
                  alt={job.title}
                  loading="lazy"
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="fw-semibold mb-1 text-truncate">{job.title || "Untitled Job"}</h5>

                  <p className="text-muted small mb-3 job-desc">
                    {(job.description || "").slice(0, 120)}
                    {(job.description || "").length > 120 ? "..." : ""}
                  </p>

                  <div className="small mb-2">
                    <i className="fa-solid fa-location-dot me-2 text-primary"></i>
                    <b>Location:</b> {job.location || "N/A"}
                  </div>

                  <div className="small mb-3">
                    <i className="fa-solid fa-sack-dollar me-2 text-primary"></i>
                    <b>Salary:</b> {job.salary || "Negotiable"}
                  </div>

                  <Link to={`/jobs/${job._id}`} className="btn btn-primary w-100 mt-auto">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Extra section: How to apply */}
      <section className="my-5">
        <div className="p-4 p-md-5 border rounded-4 shadow-sm">
          <h4 className="fw-bold mb-2">How to Apply</h4>
          <p className="text-muted mb-4">3 steps to apply for any job.</p>

          <div className="row g-4">
            {[
              { t: "Login as Worker", d: "Only worker accounts can apply.", icon: "fa-user" },
              { t: "Open Job Details", d: "Check location, salary, and description.", icon: "fa-file-lines" },
              { t: "Upload CV & Apply", d: "Upload PDF/DOC/DOCX and submit.", icon: "fa-paper-plane" },
            ].map((x) => (
              <div className="col-12 col-md-4" key={x.t}>
                <div className="p-4 border rounded-4 h-100">
                  <div className="text-primary fs-4 mb-2">
                    <i className={`fa-solid ${x.icon}`}></i>
                  </div>
                  <div className="fw-bold">{x.t}</div>
                  <div className="text-muted">{x.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}