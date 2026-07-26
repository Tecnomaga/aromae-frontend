import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verifica se o token é válido buscando os dados do usuário
      api.get('/auth/me')
        .then(({ data }) => {
          setUser(data);
        })
        .catch((err) => {
          console.error('Erro ao buscar usuário:', err);
          // Token inválido ou expirado: remove e redireciona para login
          localStorage.removeItem('token');
          setUser(null);
          // Se não estiver na página de login, redireciona
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, senha) {
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', data.token);
      setUser(data.revendedora);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function registrar(nome, email, senha, indicadoPor = '') {
    try {
      const { data } = await api.post('/auth/register', { nome, email, senha, indicadoPor });
      localStorage.setItem('token', data.token);
      setUser(data.revendedora);
      return data;
    } catch (error) {
      throw error;
    }
  }

  function atualizarUsuario(dadosParciais) {
    setUser((atual) => ({ ...atual, ...dadosParciais }));
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
    // Redireciona para a página inicial (Landing)
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        registrar, 
        logout, 
        atualizarUsuario 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
