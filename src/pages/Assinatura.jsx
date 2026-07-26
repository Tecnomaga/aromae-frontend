import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, CreditCard, Warning } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Assinatura() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleCancelSubscription = async () => {
    try {
      await toast.promise(
        api.post('/payments/cancel'),
        {
          loading: 'Cancelando assinatura...',
          success: 'Assinatura cancelada com sucesso!',
          error: 'Erro ao cancelar. Tente novamente.'
        }
      );
      // Recarrega os dados do usuário
      const { data } = await api.get('/auth/me');
      setUser(data);
      setShowConfirmCancel(false);
    } catch (err) {
      toast.error('Não foi possível cancelar. Verifique sua conexão.');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando informações da assinatura...</div>;
  if (!user) return <div className="p-8 text-center">Usuário não encontrado.</div>;

  const planoNome = {
    basico: 'Básico',
    pro: 'Pro',
    premium: 'Premium',
    trial: 'Teste Grátis (3 dias)'
  }[user.plano] || 'Não definido';

  const diasRestantes = user.assinaturaExpira 
    ? Math.ceil((new Date(user.assinaturaExpira) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const expirado = diasRestantes <= 0 && user.plano !== 'trial';

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in-up">
      <h1 className="font-titulo text-3xl text-primaria mb-2">Minha Assinatura</h1>
      <p className="text-texto/50 text-sm mb-6">Gerencie seu plano e veja os detalhes da sua assinatura.</p>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        {/* Plano atual */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <span className="text-texto/60 text-sm">Plano atual</span>
          <span className="font-bold text-lg text-primaria">{planoNome}</span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <span className="text-texto/60 text-sm">Status</span>
          <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
            user.assinaturaAtiva ? 'bg-sucesso/20 text-sucesso' : 'bg-red-100 text-red-500'
          }`}>
            {user.assinaturaAtiva ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {user.assinaturaAtiva ? 'Ativa' : 'Inativa'}
          </span>
        </div>

        {/* Data de expiração */}
        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
          <span className="text-texto/60 text-sm">Data de expiração</span>
          <span className="font-medium flex items-center gap-2">
            {user.assinaturaExpira ? new Date(user.assinaturaExpira).toLocaleDateString('pt-BR') : '--/--/----'}
            {user.assinaturaExpira && !expirado && (
              <span className="text-xs bg-primaria/10 text-primaria px-2 py-0.5 rounded-full">
                {diasRestantes} dias
              </span>
            )}
            {expirado && <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Expirado</span>}
          </span>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {(!user.assinaturaAtiva || expirado) && (
          <Link to="/planos" className="btn-primary flex items-center justify-center gap-2 flex-1">
            <CreditCard size={18} /> Renovar / Assinar
          </Link>
        )}
        {user.assinaturaAtiva && !expirado && (
          <>
            <Link to="/planos" className="btn-secondary flex items-center justify-center gap-2 flex-1">
              <CreditCard size={18} /> Trocar Plano
            </Link>
            {user.plano !== 'trial' && (
              <button
                onClick={() => setShowConfirmCancel(true)}
                className="bg-red-50 text-red-500 py-2 rounded-xl font-semibold flex items-center justify-center gap-2 flex-1 hover:bg-red-100 transition"
              >
                <XCircle size={18} /> Cancelar
              </button>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmação de cancelamento */}
      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-pop">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Warning size={24} className="text-red-500" weight="bold" />
            </div>
            <h3 className="font-titulo text-xl text-texto text-center mb-2">Cancelar assinatura</h3>
            <p className="text-sm text-texto/70 text-center mb-6">
              Tem certeza? Sua loja será desativada e você perderá acesso ao painel. Seus dados ficarão salvos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmCancel(false)}
                className="flex-1 py-2 border border-gray-200 rounded-xl font-semibold text-texto hover:bg-gray-50 transition"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Cancelar mesmo assim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
