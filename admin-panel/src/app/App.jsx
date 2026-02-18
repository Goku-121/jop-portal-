import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "../routes/AdminRoute";

import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/AdminLogin";
import AdminRegister from "../pages/AdminRegister";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Jobs from "../pages/Jobs";
import Applications from "../pages/Applications";

export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* protected */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/jobs" element={<Jobs />} />
          <Route path="/admin/applications" element={<Applications />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
}
