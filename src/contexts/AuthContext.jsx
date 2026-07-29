import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário e token do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('@Aromae:user');
    const storedToken = localStorage.getItem('@Aromae:token');

    if (storedUser && storedToken) {
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, senha, rememberMe = false) => {
    const { data } = await api.post('/auth/login', { email, senha });
    const loggedUser = data.revendedora;
    const token = data.token;

    // Salva no localStorage
    localStorage.setItem('@Aromae:user', JSON.stringify(loggedUser));
    localStorage.setItem('@Aromae:token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;

    setUser(loggedUser);
  };

  const registrar = async (nome, email, senha, indicadoPor = '') => {
    const { data } = await api.post('/auth/register', { nome, email, senha, indicadoPor });
    const newUser = data.revendedora;
    const token = data.token;

    localStorage.setItem('@Aromae:user', JSON.stringify(newUser));
    localStorage.setItem('@Aromae:token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;

    setUser(newUser);
    return data;
  };

  const atualizarUsuario = (dadosParciais) => {
    const updatedUser = { ...user, ...dadosParciais };
    localStorage.setItem('@Aromae:user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('@Aromae:user');
    localStorage.removeItem('@Aromae:token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registrar, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
