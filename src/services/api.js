import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Ocorreu um erro na requisição.';

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Sessão expirada. Faça login novamente.');
    } else {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;
