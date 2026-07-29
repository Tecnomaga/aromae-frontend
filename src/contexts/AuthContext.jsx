import { createContext, useContext, useState } from 'react';
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

  const login = async (email, senha) => {
    const { data } = await api.post('/auth/login', { email, senha });
    if (!data.revendedora || !data.token) {
      throw new Error('Resposta de login inválida.');
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.revendedora));
    setUser(data.revendedora);
  };

  const registrar = async (nome, email, senha, indicadoPor) => {
    const { data } = await api.post('/auth/register', { nome, email, senha, indicadoPor });
    if (!data.revendedora || !data.token) {
      throw new Error('Resposta de cadastro inválida.');
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.revendedora));
    setUser(data.revendedora);
    return data;
  };

  const atualizarUsuario = (dados) => {
    setUser((atual) => {
      const updated = atual ? { ...atual, ...dados } : dados;
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, registrar, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
