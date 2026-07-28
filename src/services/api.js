import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aromae-api.onrender.com/api',
  timeout: 15000
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
    console.error('Erro na requisição:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Tratamento de erro 401 (não autorizado) – token expirado
    if (error.response?.status === 401) {
      // Se não for a rota de login, limpa token e redireciona
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
