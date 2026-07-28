import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!novaSenha || !confirmacao) {
      toast.error('Preencha todos os campos.');
      return;
    }
    if (novaSenha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmacao) {
      toast.error('As senhas nao coincidem.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, novaSenha });
      toast.success('Senha redefinida com sucesso!');
      navigate('/login');
    } catch (err) {
      const mensagem = err.response && err.response.data ? err.response.data.message : 'Erro ao redefinir senha.';
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm text-center">
          <h1 className="font-titulo text-2xl text-red-500 mb-4">Link invalido</h1>
          <p className="text-texto/70 mb-6">Token de recuperacao nao encontrado. Solicite novamente.</p>
          <Link to="/recuperar-senha" className="text-primaria font-semibold hover:underline">
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        <Link to="/login" className="inline-flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
          <ArrowLeft size={20} /> Voltar para login
        </Link>
        <h1 className="font-titulo text-2xl text-primaria mb-2">Redefinir senha</h1>
        <p className="text-texto/70 mb-6">Digite sua nova senha abaixo.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            required
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
          >
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </form>
      </div>
    </div>
  );
}
