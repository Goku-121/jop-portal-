import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/authSlice";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) return;
    // if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "worker") navigate("/profile");
    else if (user.role === "company") navigate("/post-job");
    else navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return alert("All fields are required");
    dispatch(loginThunk({ identifier, password }));
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="mb-4">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Email or Admin ID"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
