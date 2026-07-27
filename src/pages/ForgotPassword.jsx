import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Esta rota precisa ser implementada no backend (envio de e-mail com link de redefinição)
      await api.post('/auth/forgot-password', { email });
      toast.success('Se o e-mail existir, enviaremos instruções de recuperação.');
    } catch (err) {
      toast.error('Erro ao solicitar recuperação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        <Link to="/login" className="inline-flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
          <ArrowLeft size={20} /> Voltar para login
        </Link>
        <h1 className="font-titulo text-2xl text-primaria mb-2">Recuperar senha</h1>
        <p className="text-texto/70 mb-6">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </button>
        </form>
      </div>
    </div>
  );
}
