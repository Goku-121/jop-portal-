import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jop-portal-gbmo.vercel.app/api",
  timeout: 30000, // ৩০ সেকেন্ড — Network Error কমাবে
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: token যোগ করা
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    const token = user ? JSON.parse(user).token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: error detail logging
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Response Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url || "unknown",
      fullError: error,
    });
    return Promise.reject(error);
  }
);

export default API;