import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
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
    try {
      console.log('📤 Enviando requisição de registro...');
      const { data } = await api.post('/auth/register', { nome, email, senha, indicadoPor });
      console.log('✅ Registro bem-sucedido, token recebido:', data.token);
      
      localStorage.setItem('token', data.token);
      setUser(data.revendedora);
      
      return data; 
    } catch (error) {
      console.error('❌ Erro no registro:', error.response?.data || error.message);
      throw error;
    }
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
