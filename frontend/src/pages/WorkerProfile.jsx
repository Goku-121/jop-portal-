import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/authSlice";

export default function WorkerProfile() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [existingCV, setExistingCV] = useState(null);
  const [loading, setLoading] = useState(false);

  const [apps, setApps] = useState([]);
  const [cvUploading, setCvUploading] = useState(false);

  // ✅ API origin auto detect (localhost remove)
  // VITE_API_URL example: https://xxx.vercel.app/api
  const API_ORIGIN = useMemo(() => {
    const base = import.meta.env.VITE_API_URL || "https://jop-portal-gbmo.vercel.app/api";
    return base.replace(/\/api\/?$/, "");
  }, []);

  // ✅ initial set + fetch existing CV
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");

    api
      .get("/cv/me")
      .then((r) => setExistingCV(r.data?.cvUrl || null))
      .catch(() => setExistingCV(null));
  }, [user]);

  // ✅ fetch my applications
  useEffect(() => {
    if (!user) return;

    api
      .get("/applications")
      .then((r) => setApps(Array.isArray(r.data) ? r.data : []))
      .catch(() => setApps([]));
  }, [user]);

  // ✅ update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put("/users/me", { name, email });

      // keep token/role from old user
      dispatch(setUser({ ...user, ...data }));

      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ upload CV (FormData)
  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional validation
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      alert("Only PDF/DOC/DOCX allowed!");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    try {
      setCvUploading(true);

      // ✅ IMPORTANT: don't set Content-Type manually
      const { data } = await api.post("/cv", formData);

      setExistingCV(data?.cvUrl || null);
      alert("CV uploaded successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "CV upload failed");
    } finally {
      setCvUploading(false);
      e.target.value = ""; // reset input
    }
  };

  if (!user || user.role !== "worker") {
    return <p className="text-center mt-5">Workers only</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Worker Profile</h2>

      <form onSubmit={handleUpdate}>
        <label className="form-label">Name</label>
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <hr />

      <label className="form-label">Upload CV</label>
      <input
        type="file"
        className="form-control mb-3"
        accept=".pdf,.doc,.docx"
        onChange={handleCVUpload}
        disabled={cvUploading}
      />

      {cvUploading && <p className="text-muted">Uploading CV...</p>}

      {existingCV && (
        <a
          href={`${API_ORIGIN}${existingCV}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-secondary"
        >
          View CV
        </a>
      )}

      <hr />

      <h4 className="mb-3">My Applications</h4>

      {apps.length === 0 ? (
        <p className="text-muted">No applications yet.</p>
      ) : (
        apps.map((a) => (
          <div key={a._id} className="card p-2 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <strong>{a.job?.title || "Job Deleted"}</strong>
              <span className="badge bg-secondary">{a.status || "pending"}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}