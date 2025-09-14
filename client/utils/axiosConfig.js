// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://civicpulse-316w.onrender.com',
});

// attach token automatically
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
