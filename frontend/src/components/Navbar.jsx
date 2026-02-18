import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import "../css/Navbar.css";

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          BanglaSkillJobs
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>
          {user?.role === "company" && (
           <>
              <li className="nav-item">
               <Link className="nav-link" to="/company/dashboard" onClick={closeMenu}>
             Dashboard
              </Link>
           </li>
          <li className="nav-item">
          <Link className="nav-link" to="/post-job" onClick={closeMenu}>
               Post Job
            </Link>
            </li>
            </>
          )}
            {user?.role === "worker" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/jobs" onClick={closeMenu}>
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={closeMenu}>
                    Profile
                  </Link>
                </li>
              </>
            )}

            {user?.role === "company" && (
              <li className="nav-item">
                <Link className="nav-link" to="/post-job" onClick={closeMenu}>
                  Post Job
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeMenu}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={closeMenu}>
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hi, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-sm btn-danger ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
