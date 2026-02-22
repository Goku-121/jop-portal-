import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://jop-portal-gbmo.vercel.app/api",
  timeout: 30000,
  withCredentials: false, // no cookies used (JWT in header)
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const raw = localStorage.getItem("user");
  if (raw) {
    const token = JSON.parse(raw)?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;