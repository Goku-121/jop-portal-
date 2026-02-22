import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jop-portal-gbmo.vercel.app/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).token
    : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;