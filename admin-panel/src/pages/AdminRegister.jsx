// src/components/AdminRegister.jsx   (or .tsx)
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../services/api";

export default function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!/^\d{12}$/.test(adminId)) {
      setError("Admin ID must be exactly 12 digits.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/admin-register", {
        name,
        email,
        adminId,
        password,
        confirmPassword,
      });

      alert("Admin account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/20 rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-indigo-500/20">
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 transform transition-transform duration-500 hover:scale-110 hover:rotate-6">
              <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.2} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Create Admin Account
            </h2>
            <p className="mt-2 text-gray-600 text-sm">
              Secure access to the administration panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm animate-shake">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                autoComplete="name"
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-200 placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                autoComplete="email"
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-200 placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Admin ID */}
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                id="adminId"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value.replace(/\D/g, ""))}
                maxLength={12}
                placeholder="12-digit Admin ID"
                required
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-200 placeholder-gray-400 text-gray-900"
              />
            </div>

            {/* Password with toggle */}
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                autoComplete="new-password"
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-200 placeholder-gray-400 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password with toggle */}
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                autoComplete="new-password"
                className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200/50 transition-all duration-200 placeholder-gray-400 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full py-3.5 px-6 rounded-xl font-semibold text-white
                bg-linear-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700
                focus:outline-none focus:ring-4 focus:ring-indigo-300/50
                shadow-lg shadow-indigo-500/30
                transition-all duration-300 transform
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2.5
                hover:shadow-xl hover:shadow-indigo-500/40
                active:scale-[0.98]
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Admin Account"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have admin access?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}