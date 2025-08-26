import axios from 'axios';

const apiClient = axios.create({ baseURL: 'http://localhost:3000/api'});

apiClient.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default apiClient;