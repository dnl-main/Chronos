// src/services/axiosConfig.js
import axios from 'axios';

const setupAxios = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.baseURL = `${apiUrl}/api`;

  axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

export default setupAxios;
