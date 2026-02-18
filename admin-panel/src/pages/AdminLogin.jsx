import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/authSlice";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginThunk({ identifier, password }));
    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload?.role !== "admin") alert("এটা admin account না!");
    }
  };

  return(
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 text-white p-6 text-center">
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-sm opacity-90">BanglaSkillJobs Admin Panel</p>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">
                Email / Admin ID
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Email or 12-digit Admin ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="w-full rounded-lg bg-slate-900 py-3 text-white font-semibold hover:bg-slate-800 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link className="text-indigo-600 font-semibold" to="/admin/register">
                Register
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Admin Panel • BanglaSkillJobs
        </p>
      </div>
    </div>
  );
}