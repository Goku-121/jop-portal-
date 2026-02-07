import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!name || !email || !password) return alert("All fields are required");
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
      return alert("Invalid email format");
    if (role === "admin") return alert("Admin registration not allowed here");

    try {
      await api.post("/auth/register", { name, email, password, role });
      alert("Registration successful! You can now login.");
      navigate("/login");
    } catch (err) {
      // Show backend error if exists
      alert(err.response?.data?.message || "Registration failed");
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
        <select
          className="form-control mb-3"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="worker">Job Seeker</option>
          <option value="company">Company / Hirer</option>
        </select>
        <button className="btn btn-primary w-100" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
