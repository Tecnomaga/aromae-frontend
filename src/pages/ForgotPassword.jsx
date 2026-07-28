import { Link } from 'react-router-dom';
import { ArrowLeft, WhatsappLogo } from 'phosphor-react';

export default function ForgotPassword() {
  const numeroSuporte = '5513996984764';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        <Link to="/login" className="inline-flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
          <ArrowLeft size={20} /> Voltar para login
        </Link>
        <h1 className="font-titulo text-2xl text-primaria mb-2">Esqueceu a senha?</h1>
        <p className="text-texto/70 mb-6">
          Entre em contato com nosso suporte para recuperar o acesso à sua conta.
        </p>
        <a
          href={`https://wa.me/${numeroSuporte}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
        >
          <WhatsappLogo size={20} weight="fill" /> Chamar suporte
        </a>
      </div>
    </div>
  );
}
