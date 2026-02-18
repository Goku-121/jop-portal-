import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useSelector } from "react-redux";

export default function CompanyDashboard() {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // only company can access
  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.role !== "company") return navigate("/");
  }, [user, navigate]);

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/company/applications");
      setApps(data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "company") fetchApps();
  }, [user, fetchApps]);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/company/applications/${appId}/status`, { status });
      alert(status === "accepted" ? "Applicant accepted ✅" : "Applicant rejected ❌");
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (!user) return null;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0">Company Dashboard</h3>
        <Link className="btn btn-primary" to="/post-job">
          + Post Job
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Applications</h5>

          {loading && <p>Loading applications...</p>}

          {!loading && apps.length === 0 && (
            <div className="alert alert-info mb-0">No applications yet for your jobs.</div>
          )}

          {!loading && apps.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Applicant</th>
                    <th>Status</th>
                    <th>CV</th>
                    <th>Applied At</th>
                  </tr>
                </thead>

                <tbody>
                  {apps.map((a) => (
                    <tr key={a._id}>
                      <td>{a.job?.title || "Job Deleted"}</td>

                      <td>
                        {a.applicant?.name || "N/A"}
                        <div className="text-muted small">{a.applicant?.email || ""}</div>
                      </td>

                      {/* ✅ Status + Accept/Reject + Lock */}
                      <td>
                        <span
                          className={`badge me-2 ${
                            a.status === "accepted"
                              ? "bg-success"
                              : a.status === "rejected"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {a.status}
                        </span>

                        {a.status === "pending" ? (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => updateStatus(a._id, "accepted")}
                            >
                              Accept
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => updateStatus(a._id, "rejected")}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-muted ms-2">
                            <i className="bi bi-lock-fill"></i> Locked
                          </span>
                        )}
                      </td>

                      <td>
                        {a.cvUrl ? (
                          <a
                            className="btn btn-sm btn-outline-primary"
                            href={`http://localhost:5000${a.cvUrl}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View CV
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td>{a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
