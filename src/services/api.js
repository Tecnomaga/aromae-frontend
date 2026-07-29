import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aromae-api.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na requisição:', error.config?.url, error.response?.status || error.message);
    return Promise.reject(error);
  }
);

export default api;
