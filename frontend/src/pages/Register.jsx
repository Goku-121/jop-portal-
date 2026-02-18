import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../store/authSlice";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) return alert("All fields are required");
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      return alert("Invalid email format");
    if (role === "admin") return alert("Admin registration not allowed here");

    const res = await dispatch(registerThunk({ name, email, password, role }));
    if (res.meta.requestStatus === "fulfilled") {
      alert("Registration successful! You can now login.");
      navigate("/login");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <h2 className="mb-4">Register as Job Seeker or Company</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <select className="form-control mb-3" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="worker">Job Seeker</option>
          <option value="company">Company / Hirer</option>
        </select>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
}
