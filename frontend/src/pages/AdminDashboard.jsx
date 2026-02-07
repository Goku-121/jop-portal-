import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    jobsThisMonth: 0,
    serviceProviders: 0,
    pendingApprovals: 0,
    companies: 0,
    activeAdmins: 0,
    totalApplications: 0, // added to avoid unused variable
  });

  const [recentJobs, setRecentJobs] = useState([]);
  const [pendingWorkers, setPendingWorkers] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const users = await API.get("/admin/users");
      const jobs = await API.get("/admin/jobs");
      const applications = await API.get("/admin/applications"); // now we will use it

      // Compute stats
      const totalJobs = jobs.data.length;
      const jobsThisMonth = jobs.data.filter(job => {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
      }).length;

      const serviceProviders = users.data.filter(u => u.role === "worker").length;
      const pendingApprovals = users.data.filter(u => u.role === "worker" && !u.verified).length;
      const companies = users.data.filter(u => u.role === "company").length;
      const activeAdmins = users.data.filter(u => u.role === "admin").length;
      const totalApplications = applications.data.length; // use applications data

      setStats({
        totalJobs,
        jobsThisMonth,
        serviceProviders,
        pendingApprovals,
        companies,
        activeAdmins,
        totalApplications,
      });

      // Recent jobs - last 3
      setRecentJobs(jobs.data.slice(-3).reverse());

      // Pending worker verifications
      setPendingWorkers(users.data.filter(u => u.role === "worker" && !u.verified).slice(0, 3));

    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard data");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <p className="text-muted">Welcome back • {new Date().toLocaleDateString()}</p>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5>Total Jobs</h5>
            <h2>{stats.totalJobs}</h2>
            <small className="text-muted">Posted this month: {stats.jobsThisMonth}</small>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5>Service Providers</h5>
            <h2>{stats.serviceProviders}</h2>
            <small className="text-muted">Active electricians, drivers, etc.</small>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5>Pending Approvals</h5>
            <h2>{stats.pendingApprovals}</h2>
            <small className="text-muted">New worker profiles</small>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5>Companies</h5>
            <h2>{stats.companies}</h2>
            <small className="text-muted">Registered employers</small>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5>Active Admins</h5>
            <h2>{stats.activeAdmins}</h2>
            <small className="text-muted">Total admins registered</small>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm p-3">
            <h5>Total Applications</h5>
            <h2>{stats.totalApplications}</h2>
            <small className="text-muted">Submitted by workers</small>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <h4>Quick Actions</h4>
        <div className="d-flex flex-wrap gap-3">
          <button className="btn btn-success">✓ Approve Workers</button>
          <button className="btn btn-primary">📋 Post Job (Company)</button>
          <button className="btn btn-warning">🏷 Manage Categories</button>
          <button className="btn btn-info">📊 View Reports</button>
          <button className="btn btn-secondary">👥 Manage Users</button>
        </div>
      </div>

      <div className="row">
        {/* Recent Job Postings */}
        <div className="col-md-6 mb-4">
          <h5>Recent Job Postings</h5>
          <ul className="list-group shadow-sm">
            {recentJobs.map(job => (
              <li key={job._id} className="list-group-item">
                <h6>{job.title} - {job.location}</h6>
                <p className="mb-0"><strong>Company:</strong> {job.companyName}</p>
                <small className="text-muted">{new Date(job.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-end">
            <a href="/admin/jobs">View All Jobs →</a>
          </div>
        </div>

        {/* Pending Worker Verifications */}
        <div className="col-md-6 mb-4">
          <h5>Pending Verifications</h5>
          <ul className="list-group shadow-sm">
            {pendingWorkers.map(worker => (
              <li key={worker._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{worker.name}</strong>
                  <br />
                  <small className="text-muted">{worker.verificationType || "NID & Certificate uploaded"}</small>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success btn-sm">Approve</button>
                  <button className="btn btn-warning btn-sm">Review</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-end">
            <a href="/admin/users">See All →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
