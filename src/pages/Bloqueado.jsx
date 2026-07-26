import { Link } from 'react-router-dom';
import { Storefront, CreditCard } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';

export default function Bloqueado() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-fundo text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md animate-fade-in-up">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Storefront size={40} className="text-red-500" />
        </div>
        <h1 className="font-titulo text-2xl text-primaria mb-2">Sua loja está pausada</h1>
        <p className="text-texto/70 mb-4">
          O seu período de teste de <strong>3 dias</strong> expirou. 
          Para continuar vendendo e mantendo sua vitrine no ar, escolha um plano.
        </p>
        <div className="flex flex-col gap-3 mt-6">
          <Link 
            to="/dashboard" 
            className="bg-primaria/10 text-primaria py-2 rounded-lg font-semibold"
          >
            Ver painel (apenas consulta)
          </Link>
          <Link 
            to="/dashboard#planos" // Se você tiver uma seção de planos no dashboard, ou uma página de planos
            className="bg-primaria text-white py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
          >
            <CreditCard size={18} className="inline mr-2" /> Assinar agora
          </Link>
        </div>
        <p className="text-xs text-texto/50 mt-6">
          Seus dados e produtos estão salvos. Ao assinar, sua loja reabre imediatamente.
        </p>
      </div>
    </div>
  );
}
