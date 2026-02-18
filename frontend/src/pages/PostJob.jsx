import React, { useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";

export default function PostJob() {
  const user = useSelector((s) => s.auth.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!title || !description || !location || !salary) {
      return alert("All fields are required!");
    }

    setLoading(true);
    try {
      // Post the job to backend
      await api.post("/jobs", { title, description, location, salary });

      // Clear form and notify user
      alert("Job posted successfully!");
      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");
    } catch (err) {
      console.error("Error posting job:", err);
      alert(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  // Only allow company users to post jobs
  if (!user || user.role !== "company") {
    return <p className="text-center mt-5">Only company users can post jobs.</p>;
  }

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="mb-4">Post a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Job Title"
          className="form-control mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Job Description"
          className="form-control mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="form-control mb-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Salary"
          className="form-control mb-2"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
