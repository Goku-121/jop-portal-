import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkerProfile from "./pages/WorkerProfile";
import PostJob from "./pages/PostJob";
import JobList from "./pages/JobList";
import JobDetail from "./pages/JobDetail";
import CompanyDashboard from "./pages/CompanyDashboard";
// import AdminLogin from "./pages/AdminLogin";
// import AdminRegister from "./pages/AdminRegister";
// import AdminDashboard from "./pages/Admin";
import Footer from "./components/Footer";
//  import AdminRoute from "./routes/AdminRoute";
// import AdminLayout from "./layouts/AdminLayout";



import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";



function App() {
  return (
    <Router>
      <Navbar />
          
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<WorkerProfile />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
          
        <Route path="/about" element={<About />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/careers" element={<Careers />} />
           <Route path="/help" element={<Help />} />
           <Route path="/privacy" element={<Privacy />} />
           <Route path="/terms" element={<Terms />} />           

        <Route path="/post-job" element={<PostJob />} />

        {/* <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} /> */}

        {/* <Route element={<AdminRoute />}> */}
          {/* <Route element={<AdminLayout />}> */}
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
        {/* </Route> */}
          
            
        <Route path="/company/dashboard" element={<CompanyDashboard />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;