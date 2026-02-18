import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useSelector } from "react-redux";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // ✅ apply states
  const [cvFile, setCvFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);

  const handleBack = () => {
    if (location.key && location.key !== "default") navigate(-1);
    else navigate("/jobs");
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        setErrMsg(err.response?.data?.message || "Failed to load job details");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // ✅ apply handler
  const handleApply = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (user.role !== "worker") {
      alert("Only workers can apply");
      return;
    }

    if (!cvFile) {
      alert("Please select a CV file first");
      return;
    }

    try {
      setApplyLoading(true);

      const formData = new FormData();
      formData.append("cv", cvFile);      // must be "cv"
      formData.append("jobId", job._id);  // must be jobId

      await api.post("/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Applied successfully!");
      setCvFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading job details...</p>;
  if (errMsg) return <p className="text-center mt-5 text-danger">{errMsg}</p>;
  if (!job) return <p className="text-center mt-5">Job not found.</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-sm btn-outline-secondary mb-3" onClick={handleBack}>
        ← Back
      </button>

      <div className="card shadow-sm">
        <div className="card-body">
          <h3>{job.title}</h3>

          <p className="text-muted">
            📍 {job.location || "N/A"} • 💰 {job.salary || "N/A"}
          </p>

          <p>{job.description}</p>

          <p>
            <strong>Posted By:</strong>{" "}
            {job.postedBy?.name || "N/A"}
          </p>

          {/* ✅ APPLY SECTION */}
          {user?.role === "worker" ? (
            <div className="mt-3">
              <label className="form-label">Upload CV (PDF/DOC/DOCX)</label>
              <input
                type="file"
                className="form-control mb-2"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
              />

              <button
                className="btn btn-success"
                onClick={handleApply}
                disabled={applyLoading}
              >
                {applyLoading ? "Applying..." : "Apply Now"}
              </button>
            </div>
          ) : (
            <small className="text-muted">
              Login as worker to apply.
            </small>
          )}
        </div>
      </div>
    </div>
  );
}
