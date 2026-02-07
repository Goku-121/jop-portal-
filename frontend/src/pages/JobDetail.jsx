import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get("/jobs"); // we'll filter manually if backend doesn't support /:id
        const jobFound = data.find(j => j._id === id);
        setJob(jobFound || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading job details...</p>;
  if (!job) return <p className="text-center mt-5">Job not found.</p>;

  return (
    <div className="container mt-4">
      <h2>{job.title}</h2>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Posted By:</strong> {job.postedBy}</p>
      <button className="btn btn-success">Apply Now</button>
    </div>
  );
}
