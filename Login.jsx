import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignIn } from 'phosphor-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro('E-mail ou senha inválidos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        <h1 className="font-titulo text-3xl text-primaria text-center mb-2">Aromaê</h1>
        <p className="text-center text-texto/70 mb-6">Entre para gerenciar seu império perfumado</p>
        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
          <button type="submit" disabled={carregando}
            className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition flex items-center justify-center gap-2 disabled:opacity-50">
            <SignIn size={20} /> {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          Não tem uma loja? <Link to="/cadastro" className="text-primaria font-semibold">Criar agora</Link>
        </p>
      </div>
    </div>
  );
}
