import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, senha, rememberMe) => {
    const { data } = await api.post('/auth/login', { email, senha });
    const loggedUser = data.revendedora;
    const token = data.token;

    if (!loggedUser || !token) {
      throw new Error('Resposta de login inválida do servidor.');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const registrar = async (nome, email, senha, indicadoPor) => {
    const { data } = await api.post('/auth/register', { nome, email, senha, indicadoPor });
    const newUser = data.revendedora;
    const token = data.token;

    if (!newUser || !token) {
      throw new Error('Resposta de cadastro inválida do servidor.');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    return data;
  };

  const atualizarUsuario = (dados) => {
    const updated = { ...user, ...dados };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
