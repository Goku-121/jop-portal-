import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://jop-portal-gbmo.vercel.app/api
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const token = JSON.parse(raw)?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Failed to read token from localStorage:", err);
  }

  return config;
});

export default API;