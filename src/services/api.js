import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Interceptor de requisição: adiciona o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: captura erros e exibe no console
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na requisição:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    // Se for erro 401 (não autenticado), manda para o login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Só redireciona se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
