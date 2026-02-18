import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { LayoutDashboard, Users, Briefcase, FileCheck, LogOut, User } from "lucide-react";

export default function AdminNavbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-indigo-900 via-indigo-800 to-blue-700 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Brand */}
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-white">
            <LayoutDashboard size={28} className="text-indigo-300" />
            <span className="text-xl font-bold tracking-tight">Admin Panel</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {user?.role === "admin" && (
              <>
                <Link to="/admin/dashboard" className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/admin/users" className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors">
                  <Users size={18} /> Users
                </Link>
                <Link to="/admin/jobs" className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors">
                  <Briefcase size={18} /> Jobs
                </Link>
                <Link to="/admin/applications" className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors">
                  <FileCheck size={18} /> Applications
                </Link>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:flex items-center gap-2 text-indigo-200">
                  <User size={18} /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="text-indigo-200 hover:text-white">
                Login
              </Link>
            )}
          </div>
        </div>
        <div className="bg-linear-to-r from-indigo-900 to-indigo-700 h-1"></div>
      </div>
    </header>
  );
}