import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jop-portal-gbmo.vercel.app/api",
  timeout: 30000, // ৩০ সেকেন্ড — Network Error কমাবে
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
  console.error("Request failed:", error);
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Response Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default API;