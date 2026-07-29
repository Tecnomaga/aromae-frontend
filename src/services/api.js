import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aromae-api.onrender.com/api',
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Aromae:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthUrl = error.config.url.includes('/auth');
      if (!isAuthUrl) {
        localStorage.removeItem('@Aromae:user');
        localStorage.removeItem('@Aromae:token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
