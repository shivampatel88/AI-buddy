import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api"; // fallback for local dev

const apiClient = axios.create({ baseURL });

apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default apiClient;