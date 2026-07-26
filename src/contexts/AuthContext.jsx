import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => setUser(data))
        .catch((err) => {
          console.error('Erro ao buscar usuário:', err);
          localStorage.removeItem('token');
          setUser(null);
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
    } catch (error) {
      throw error; // O erro será capturado no Login.jsx
    }
  }

  async function registrar(nome, email, senha, indicadoPor = '') {
    try {
      const { data } = await api.post('/auth/register', { nome, email, senha, indicadoPor });
      localStorage.setItem('token', data.token);
      setUser(data.revendedora);
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
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registrar, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
