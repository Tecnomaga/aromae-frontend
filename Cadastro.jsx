import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await registrar(nome, email, senha);
      navigate('/onboarding');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao criar conta.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        <h1 className="font-titulo text-3xl text-primaria text-center mb-2">Criar sua loja</h1>
        <p className="text-center text-texto/70 mb-6">Comece sua jornada aromática</p>
        {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
          <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
          <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
          <button type="submit" disabled={carregando}
            className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50">
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          Já tem uma loja? <Link to="/login" className="text-primaria font-semibold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
