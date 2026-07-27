import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, WhatsappLogo } from 'phosphor-react';

export default function CheckoutSuccess() {
  const location = useLocation();
  
  // Recupera os dados do pedido do sessionStorage
  const pendingOrder = sessionStorage.getItem('pendingPixOrder');
  const orderData = pendingOrder ? JSON.parse(pendingOrder) : null;

  // Limpa os dados após exibir
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('pendingPixOrder');
    };
  }, []);

  // Se não houver dados, usa fallback
  const produtoNome = orderData?.produtoNome || 'seu perfume';
  const revendedoraWhatsApp = orderData?.revendedoraWhatsApp || '';

  const mensagemWhatsApp = `Olá! Acabei de finalizar a compra do *${produtoNome}* pelo site Aromaê. Pode me confirmar os detalhes de entrega?`;

  return (
    <div className="min-h-screen bg-fundo flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-sucesso/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-sucesso" weight="fill" />
        </div>
        <h1 className="font-titulo text-3xl text-primaria mb-2">Pagamento confirmado! 🎉</h1>
        <p className="text-texto/70 text-lg mb-4">
          Seu pedido foi registrado com sucesso. A revendedora será notificada e em breve entrará em contato.
        </p>
        <div className="bg-fundo p-4 rounded-xl text-left text-sm text-texto/70 mb-6">
          <p className="font-semibold text-texto mb-2">O que fazer agora:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Aguarde o contato da revendedora.</li>
            <li>Combine os detalhes de entrega.</li>
            <li>Fique à vontade para tirar dúvidas.</li>
          </ul>
        </div>
        <div className="space-y-3">
          <a
            href={`https://wa.me/${revendedoraWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
          >
            <WhatsappLogo size={20} weight="fill" /> Falar com a revendedora
          </a>
          <Link
            to="/"
            className="block w-full bg-gray-100 text-texto py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
