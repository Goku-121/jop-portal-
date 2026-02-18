import { Outlet, Link } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import { LayoutDashboard, Users, Briefcase, FileCheck } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <nav className="p-6 space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition"
            >
              <LayoutDashboard size={20} /> Dashboard
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition"
            >
              <Users size={20} /> Users
            </Link>

            <Link
              to="/admin/jobs"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition"
            >
              <Briefcase size={20} /> Jobs
            </Link>

            <Link
              to="/admin/applications"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition"
            >
              <FileCheck size={20} /> Applications
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
