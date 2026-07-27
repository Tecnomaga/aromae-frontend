import { useNavigate } from 'react-router-dom';
import { Headset, Question, WhatsappLogo, X } from 'phosphor-react';

export default function Suporte() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-titulo text-3xl text-primaria mb-6">Suporte e Ajuda</h1>
        <button onClick={() => navigate(-1)} className="text-texto/40 hover:text-texto p-1">
          <X size={24} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
          <Headset size={24} className="text-primaria" /> Fale conosco
        </h2>
        <p className="text-sm text-texto/70 mb-4">
          Precisa de ajuda para configurar sua loja, tirar dúvidas sobre pagamentos ou relatar um problema? 
          Estamos aqui para você.
        </p>
        <a 
          href="https://wa.me/5513996984764" 
          target="_blank" 
          className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition"
        >
          <WhatsappLogo size={20} weight="fill" /> Chamar Suporte
        </a>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
          <Question size={24} className="text-primaria" /> Perguntas Frequentes
        </h2>
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <p className="font-semibold text-sm">Como cadastrar produtos?</p>
            <p className="text-xs text-texto/50 mt-1">Vá em "Produtos" e clique em "Novo Produto". Preencha as informações e adicione até 3 fotos.</p>
          </div>
          <div className="border-b border-gray-100 pb-3">
            <p className="font-semibold text-sm">Onde coloco minha chave Pix?</p>
            <p className="text-xs text-texto/50 mt-1">Acesse "Perfil" &gt; "Editar Perfil" e insira sua chave Pix no campo correspondente. O repasse das vendas será feito automaticamente para lá.</p>
          </div>
          <div className="pb-1">
            <p className="font-semibold text-sm">Como compartilho minha vitrine?</p>
            <p className="text-xs text-texto/50 mt-1">Vá em "Perfil" e clique nos botões de "Copiar link" ou "WhatsApp/Instagram". O link é automático.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
