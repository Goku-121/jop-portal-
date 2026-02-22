import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "https://jop-portal-gbmo.vercel.app/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  // ❌ headers এ Content-Type fixed 
});

// Token auto add + FormData 
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("user");
      const token = raw ? JSON.parse(raw)?.token : null;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}

    //  FormData 
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      // JSON 
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;