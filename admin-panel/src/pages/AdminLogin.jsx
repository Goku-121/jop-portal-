import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/authSlice";
import { User, KeyRound, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginThunk({ identifier, password }));

    if (res.meta.requestStatus === "fulfilled") {
      if (res.payload?.role !== "admin") {
        alert("It's not an admin account!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-700 to-pink-600 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-48 -right-48 w-125 h-125 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/92 backdrop-blur-2xl shadow-2xl shadow-black/25 rounded-3xl border border-white/20 overflow-hidden transition-all duration-500 hover:shadow-indigo-500/30">
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-purple-700 text-white p-8 text-center relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 transform transition-transform duration-500 hover:scale-110 hover:rotate-6">
              <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold mt-6">Admin Login</h1>
            <p className="text-sm opacity-90 mt-2">BanglaSkillJobs Admin Panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm animate-shake">
                {error}
              </div>
            )}

            {/* Identifier field */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none transition-colors duration-200" />
              <input
                type="text"
                placeholder="Email or 12-digit Admin ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/40 transition-all duration-300 placeholder-gray-500 text-gray-900"
              />
            </div>

            {/* Password field with toggle */}
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none transition-colors duration-200" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-11 py-3.5 bg-white/60 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/40 transition-all duration-300 placeholder-gray-500 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3.5 px-6 rounded-xl font-semibold text-white
                bg-linear-to-r from-indigo-600 to-purple-700
                hover:from-indigo-700 hover:to-purple-800
                focus:outline-none focus:ring-4 focus:ring-indigo-300/50
                shadow-lg shadow-indigo-600/30
                transition-all duration-300 transform
                disabled:opacity-70 disabled:cursor-not-allowed
                flex items-center justify-center gap-2.5
                hover:shadow-xl hover:shadow-indigo-600/40
                active:scale-[0.98]
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login to Admin Panel"
              )}
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an admin account?{" "}
              <Link
                to="/admin/register"
                className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/70">
          © {new Date().getFullYear()} BanglaSkillJobs • Admin Only
        </p>
      </div>
    </div>
  );
}