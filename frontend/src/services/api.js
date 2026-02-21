import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jop-portal-idpl.vercel.app/api", // ← backend URL বসাও
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")).token 
    : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;