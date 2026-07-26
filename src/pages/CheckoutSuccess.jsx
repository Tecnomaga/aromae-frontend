import { Link } from 'react-router-dom';
import { CheckCircle, Storefront } from 'phosphor-react';

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-fundo flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-sucesso/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-sucesso" weight="fill" />
        </div>
        <h1 className="font-titulo text-3xl text-primaria mb-2">Parabéns! 🎉</h1>
        <p className="text-texto/70 text-lg mb-4">
          Sua assinatura Aromaê foi ativada com sucesso!
        </p>
        <div className="bg-fundo p-4 rounded-xl text-left text-sm text-texto/70 mb-6">
          <p className="font-semibold text-texto mb-2">O que fazer agora:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Cadastre seus produtos com fotos e preços.</li>
            <li>Compartilhe o link da sua vitrine no WhatsApp.</li>
            <li>Cadastre sua chave Pix no Perfil para receber as vendas.</li>
          </ul>
        </div>
        <Link 
          to="/dashboard" 
          className="block w-full bg-primaria text-white py-3 rounded-xl font-semibold hover:bg-primaria/90 transition"
        >
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  );
}
