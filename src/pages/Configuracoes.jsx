import { useState } from 'react';
import { CaretDown, CaretUp, Question, Headset, FileText, ShieldCheck } from 'phosphor-react';

const faq = [
  {
    pergunta: 'Como adicionar um novo produto?',
    resposta: 'Vá em "Produtos" no menu, clique em "Novo Produto" e preencha as informações. Você pode adicionar até 3 fotos.'
  },
  {
    pergunta: 'Como funciona o estoque?',
    resposta: 'Ao cadastrar um produto, defina a quantidade inicial. Quando vender, dê baixa manual ou o sistema fará isso automaticamente ao registrar um pedido.'
  },
  {
    pergunta: 'Como compartilhar minha loja?',
    resposta: 'No seu Perfil, clique em "Copiar link" ou use os botões de WhatsApp e Instagram. Sua vitrine estará disponível publicamente.'
  },
  {
    pergunta: 'Posso pausar minha loja?',
    resposta: 'Sim! No Perfil, clique em "Pausar loja". Seus produtos não aparecerão no catálogo público enquanto estiver pausada.'
  },
  {
    pergunta: 'Como faço para trocar minha senha?',
    resposta: 'Em breve você poderá trocar sua senha diretamente no perfil. Por enquanto, entre em contato com o suporte.'
  }
];

export default function Configuracoes() {
  const [aberto, setAberto] = useState(null);
  const toggleFaq = (index) => setAberto(aberto === index ? null : index);
  const contatoSuporte = '5513996984764'; // <--- SEU NÚMERO AQUI

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-titulo text-3xl text-primaria mb-6">Configurações</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
          <Question size={24} className="text-primaria" /> Perguntas Frequentes
        </h2>
        <div className="space-y-2">
          {faq.map((item, index) => (
            <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-sm hover:bg-gray-50"
              >
                {item.pergunta}
                {aberto === index ? <CaretUp size={18} /> : <CaretDown size={18} />}
              </button>
              {aberto === index && (
                <div className="px-4 pb-3 text-sm text-texto/70">{item.resposta}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
          <Headset size={24} className="text-primaria" /> Suporte
        </h2>
        <p className="text-sm text-texto/70 mb-3">
          Precisa de ajuda? Fale diretamente com nossa equipe pelo WhatsApp.
        </p>
        <a
          href={`https://wa.me/${contatoSuporte}`} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          <Headset size={18} /> Chamar suporte
        </a>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
          <FileText size={24} className="text-primaria" /> Documentos
        </h2>
        <div className="space-y-2">
          <a href="/termos" className="flex items-center gap-2 text-sm text-texto/70 hover:text-primaria">
            <ShieldCheck size={18} /> Termos de Uso
          </a>
          <a href="/privacidade" className="flex items-center gap-2 text-sm text-texto/70 hover:text-primaria">
            <ShieldCheck size={18} /> Política de Privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
