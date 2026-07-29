import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Tenta validar o token
    api.get('/auth/me')
      .then(({ data }) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Falha ao validar token:', err.response?.status || err.message);
        // SÓ remove o token se for 401 (token realmente inválido)
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
        // Se for erro de rede (Render dormindo), mantém o token para tentar depois
        setUser(null);
        setLoading(false);
      });
  }, []);

  async function login(email, senha, rememberMe = false) {
    const { data } = await api.post('/auth/login', { email, senha });
    if (rememberMe) {
      localStorage.setItem('token', data.token);
    } else {
      sessionStorage.setItem('token', data.token);
    }
    setUser(data.revendedora);
  }

  async function registrar(nome, email, senha, indicadoPor = '') {
    const { data } = await api.post('/auth/register', { nome, email, senha, indicadoPor });
    localStorage.setItem('token', data.token);
    setUser(data.revendedora);
    return data;
  }

  function atualizarUsuario(dadosParciais) {
    setUser((atual) => ({ ...atual, ...dadosParciais }));
  }

  function logout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registrar, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
