import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function WorkerProfile() {
  const { user, login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [existingCV, setExistingCV] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load profile + CV
  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setEmail(user.email || "");

    const fetchCV = async () => {
      try {
        const { data } = await api.get("/cv/me");
        if (data?.cvUrl) setExistingCV(data.cvUrl);
      } catch (err) {
        console.error("Failed to fetch CV");
      }
    };

    fetchCV();
  }, [user]);

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.put("/users/me", { name, email });

      // Update auth context + localStorage
      login({
        ...user,
        name: data.name,
        email: data.email,
      });

      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // Upload CV
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      const { data } = await api.post("/cv", formData);
      setExistingCV(data.cvUrl);
      alert("CV uploaded successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "CV upload failed");
    }
  };

  // Guard
  if (!user || user.role !== "worker") {
    return <p className="text-center mt-5">Workers only</p>;
  }

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="mb-4">Worker Profile</h2>

      <form onSubmit={handleUpdate}>
        <label>Name</label>
        <input
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <hr />

      <label>Upload CV</label>
      <input
        type="file"
        className="form-control mb-3"
        accept=".pdf,.doc,.docx"
        onChange={handleCVUpload}
      />

      {existingCV && (
        <div className="mt-3">
          <a
            href={`http://localhost:5000/${existingCV}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-secondary"
          >
            View CV
          </a>
        </div>
      )}
    </div>
  );
}
