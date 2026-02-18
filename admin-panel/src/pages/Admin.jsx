
import { Link } from 'react-router-dom'; 

export default function Admin() {
  // These would come from API/state in a real app
  const stats = {
    totalJobs: 342,
    activeWorkers: 1287,
    pendingApprovals: 47,
    registeredCompanies: 89,
    newApplicationsThisWeek: 63,
};

return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-600">Welcome back • {new Date().toLocaleDateString('en-BD')}</span>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Jobs</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalJobs}</p>
          <p className="text-sm text-gray-500 mt-1">Posted this month</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Service Providers</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeWorkers}</p>
          <p className="text-sm text-gray-500 mt-1">Active electricians, drivers, etc.</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">{stats.pendingApprovals}</p>
          <p className="text-sm text-gray-500 mt-1">New worker profiles</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Companies</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{stats.registeredCompanies}</p>
          <p className="text-sm text-gray-500 mt-1">Registered employers</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link
            to="/admin/workers/pending"
            className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 p-5 rounded-lg transition"
          >
            <span className="text-2xl mb-2">✓</span>
            <span className="font-medium">Approve Workers</span>
          </Link>

          <Link
            to="/admin/jobs/new"
            className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 p-5 rounded-lg transition"
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="font-medium">Post Job (Company)</span>
          </Link>

          <Link
            to="/admin/categories"
            className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 p-5 rounded-lg transition"
          >
            <span className="text-2xl mb-2">🏷️</span>
            <span className="font-medium">Manage Categories</span>
          </Link>

          <Link
            to="/admin/reports"
            className="flex flex-col items-center justify-center bg-yellow-50 hover:bg-yellow-100 p-5 rounded-lg transition"
          >
            <span className="text-2xl mb-2">📊</span>
            <span className="font-medium">View Reports</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center justify-center bg-red-50 hover:bg-red-100 p-5 rounded-lg transition"
          >
            <span className="text-2xl mb-2">👥</span>
            <span className="font-medium">Manage Users</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Postings */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Job Postings</h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Urgent Driver Needed - Gulshan</p>
                <p className="text-sm text-gray-600">Company: ABC Logistics</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Today</span>
            </li>
            <li className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Full-time Plumber - Dhanmondi</p>
                <p className="text-sm text-gray-600">Posted by Home Services Ltd.</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Yesterday</span>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Night Cleaner for Office - Banani</p>
                <p className="text-sm text-gray-600">Salary: ৳18,000+</p>
              </div>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">2 days ago</span>
            </li>
          </ul>
          <div className="mt-4 text-right">
            <Link to="/admin/jobs" className="text-blue-600 hover:underline">View All Jobs →</Link>
          </div>
        </div>

        {/* Pending Worker Verifications */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Verifications</h2>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Rahim Mia - Electrician</p>
                <p className="text-sm text-gray-600">NID & Certificate uploaded</p>
              </div>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                Approve
              </button>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Fatema Begum - Cleaner</p>
                <p className="text-sm text-gray-600">Awaiting police verification</p>
              </div>
              <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                Review
              </button>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="font-medium">Karim Hossain - Driver</p>
                <p className="text-sm text-gray-600">License pending</p>
              </div>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                Approve
              </button>
            </li>
          </ul>
          <div className="mt-4 text-right">
            <Link to="/admin/workers/pending" className="text-blue-600 hover:underline">See All →</Link>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-10 text-center text-sm text-gray-500">
        BD Service Jobs Admin • Manage drivers, electricians, plumbers & cleaners hiring in Bangladesh
      </div>
    </div>
  );
}