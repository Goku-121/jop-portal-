import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jop-portal-gbmo.vercel.app/api", // ← এখানে তোমার backend URL ঠিক আছে
  timeout: 30000, // ৩০ সেকেন্ড টাইমআউট (Network Error কমাবে)
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).token
    : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error("Request interceptor error:", error);
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response interceptor error:", error.message, error.response?.data);
    return Promise.reject(error);
  }
);

export default API;