import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

API.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = JSON.parse(user)?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;