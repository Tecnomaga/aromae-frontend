import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, XCircle, CreditCard } from 'phosphor-react';
import api from '../services/api';

export default function Assinatura() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando informações da assinatura...</div>;
  if (!user) return <div className="p-8 text-center">Usuário não encontrado.</div>;

  // Funções auxiliares
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

        {/* Próximo ciclo (se for recorrência) */}
        {user.assinaturaAtiva && user.assinaturaExpira && !expirado && (
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-texto/60 text-sm">Próximo ciclo</span>
            <span className="font-medium flex items-center gap-2">
              <Clock size={16} className="text-texto/40" />
              {new Date(user.assinaturaExpira).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}
      </div>

      {/* Botão de ação */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        {(!user.assinaturaAtiva || expirado) && (
          <Link to="/planos" className="btn-primary flex items-center justify-center gap-2 flex-1">
            <CreditCard size={18} /> Renovar / Assinar
          </Link>
        )}
        {user.assinaturaAtiva && !expirado && (
          <Link to="/planos" className="btn-secondary flex items-center justify-center gap-2 flex-1">
            <CreditCard size={18} /> Gerenciar
          </Link>
        )}
      </div>
    </div>
  );
        }
