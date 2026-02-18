// src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { Users, Briefcase, FileText, TrendingUp, AlertCircle } from "lucide-react";
import "../styles/Dashboard.css";

const fetchStats = async () => {
  const [usersRes, jobsRes, appsRes] = await Promise.all([
    api.get("/admin/users", { params: { limit: 0 } }),
    api.get("/admin/jobs", { params: { limit: 0 } }),
    api.get("/admin/applications", { params: { limit: 0 } }),
  ]);

  return {
    users: usersRes.data.total || usersRes.data.count || usersRes.data.length || 0,
    jobs: jobsRes.data.total || jobsRes.data.count || jobsRes.data.length || 0,
    apps: appsRes.data.total || appsRes.data.count || appsRes.data.length || 0,
  };
};

export default function Dashboard() {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users ?? 0,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      link: "/admin/users",
    },
    {
      title: "Total Jobs",
      value: stats?.jobs ?? 0,
      icon: Briefcase,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      link: "/admin/jobs",
    },
    {
      title: "Total Applications",
      value: stats?.apps ?? 0,
      icon: FileText,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-100",
      link: "/admin/applications",
    },
    {
      title: "Trend (This Month)",
      value: "+12%",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      link: "#",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gray-200" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-8 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto text-red-500" size={64} />
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Failed to load dashboard</h2>
          <p className="mt-3 text-gray-600">Please check your connection or try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`group flex flex-col items-center justify-center p-6 text-center rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${card.bg} ${card.border} ${card.link === "#" ? "pointer-events-none cursor-default" : "cursor-pointer"}`}
          >
            <card.icon size={48} className={`${card.color} mb-4 transition-transform duration-300 group-hover:scale-110`} strokeWidth={1.5} />
            <h6 className="mb-1 text-sm font-medium text-gray-600">{card.title}</h6>
            <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
        <h5 className="mb-4 text-xl font-semibold text-gray-800">Quick Overview</h5>
        <p className="text-gray-600">
          You can add charts, recent jobs list, pending verifications, or other analytics here...
        </p>
      </div>
    </div>
  );
}