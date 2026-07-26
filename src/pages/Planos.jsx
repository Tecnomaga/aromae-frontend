import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkle, Users, FileCsv, X } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Planos() {
  const [periodo, setPeriodo] = useState('mensal');
  const [loading, setLoading] = useState(false);

  const handleAssinar = async (tipoPlano) => {
    setLoading(true);
    try {
      const response = await api.post('/payments/subscribe', {
        tipoPlano,
        periodo,
      });
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.error('Erro: URL de pagamento não retornada.');
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      // Verifica o tipo de erro
      if (error.response && error.response.status === 401) {
        toast.error('Você não está logado. Faça login novamente.');
      } else if (error.response && error.response.status === 500) {
        toast.error('Erro no servidor. Entre em contato com o suporte.');
      } else if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else if (error.request) {
        toast.error('Erro de conexão. Verifique se o servidor está no ar.');
      } else {
        toast.error('Erro ao gerar link de pagamento. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const planos = [
    {
      id: 'basico',
      nome: 'Básico',
      precoMensal: 19.90,
      precoAnual: 199.00,
      features: ['Vitrine ilimitada', 'Gestão de estoque', 'Clientes', 'Pedidos via WhatsApp'],
      icon: <Sparkle size={24} />,
    },
    {
      id: 'pro',
      nome: 'Pro',
      precoMensal: 29.90,
      precoAnual: 299.00,
      features: ['Tudo do Básico', 'Relatórios de lucro', 'Exportação CSV', '✔️ Checkout Pix (vendas diretas)'],
      icon: <FileCsv size={24} />,
      destaque: true,
    },
    {
      id: 'premium',
      nome: 'Premium',
      precoMensal: 49.90,
      precoAnual: 499.00,
      features: ['Tudo do Pro', 'Múltiplos usuários', 'Suporte prioritário', '✔️ Checkout Pix + comissão reduzida'],
      icon: <Users size={24} />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-titulo text-3xl text-primaria mb-1">Planos</h1>
          <p className="text-texto/50">Escolha o plano ideal para seu negócio</p>
        </div>
        <Link to="/dashboard" className="text-texto/50 hover:text-primaria">
          <X size={24} />
        </Link>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setPeriodo('mensal')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              periodo === 'mensal' ? 'bg-white shadow-sm text-primaria' : 'text-texto/50'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setPeriodo('anual')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              periodo === 'anual' ? 'bg-white shadow-sm text-primaria' : 'text-texto/50'
            }`}
          >
            Anual (economize até 20%)
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <motion.div
            key={plano.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: plano.destaque ? 0.2 : 0 }}
            className={`relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all ${
              plano.destaque ? 'border-2 border-primaria shadow-md' : 'border border-gray-100'
            }`}
          >
            {plano.destaque && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primaria text-white px-3 py-0.5 rounded-full text-xs font-bold">
                Mais popular
              </span>
            )}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primaria/10 flex items-center justify-center text-primaria">
                {plano.icon}
              </div>
              <h3 className="font-titulo text-xl">{plano.nome}</h3>
            </div>
            <p className="text-3xl font-bold text-primaria">
              R$ {periodo === 'mensal' ? plano.precoMensal.toFixed(2) : plano.precoAnual.toFixed(2)}
            </p>
            <p className="text-sm text-texto/50">{periodo === 'mensal' ? 'por mês' : 'por ano'}</p>
            <ul className="mt-6 space-y-2 text-sm text-texto/70">
              {plano.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-sucesso" weight="fill" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleAssinar(plano.id)}
              disabled={loading}
              className={`mt-6 w-full py-2 rounded-xl font-semibold transition-all ${
                plano.destaque
                  ? 'bg-primaria text-white hover:bg-primaria/90'
                  : 'bg-gray-100 hover:bg-gray-200 text-texto'
              }`}
            >
              {loading ? 'Carregando...' : 'Assinar'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-2xl text-center text-sm text-texto/60">
        <p className="font-semibold text-texto/80">⚡ Taxa de repasse</p>
        <p>Para vendas realizadas via <strong>Checkout Pix</strong>, a plataforma cobra uma comissão de <strong>5%</strong> sobre o valor da venda (descontada automaticamente). Planos Básico não possuem Checkout Pix.</p>
        <p className="mt-2 text-xs">Sem fidelidade. Cancele quando quiser.</p>
      </div>
    </div>
  );
}
