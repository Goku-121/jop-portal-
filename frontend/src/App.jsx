import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkerProfile from "./pages/WorkerProfile";
import PostJob from "./pages/PostJob";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";

import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister"; // Don't forget to import this
import AdminDashboard from "./pages/Admin";

import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar only for normal users */}
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Worker Routes */}
          <Route path="/profile" element={<WorkerProfile />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Company Routes */}
          <Route path="/post-job" element={<PostJob />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-register" element={<AdminRegister />} />

          {/* Protected Admin Dashboard */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
