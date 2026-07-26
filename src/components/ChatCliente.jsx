import { useState, useEffect, useRef } from 'react';
import { PaperPlaneTilt, X } from 'phosphor-react';
import api from '../services/api';

export default function ChatCliente({ clienteId, revendedoraId, onClose }) {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const carregarMensagens = async () => {
    try {
      const { data } = await api.get(`/chat/${clienteId}`);
      setMensagens(data);
    } catch (error) {
      console.error('Erro ao carregar chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const enviarMensagem = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    try {
      const { data } = await api.post('/chat', { clienteId, texto, remetente: 'revendedora' });
      setMensagens([...mensagens, data]);
      setTexto('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  useEffect(() => {
    carregarMensagens();
    // Simulação de atualização em tempo real (para produção, use WebSockets)
    const interval = setInterval(carregarMensagens, 5000);
    return () => clearInterval(interval);
  }, [clienteId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  return (
    <div className="fixed bottom-20 right-4 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-primaria text-white">
        <h4 className="font-semibold text-sm">Chat com o cliente</h4>
        <button onClick={onClose} className="hover:opacity-80">
          <X size={20} />
        </button>
      </div>
      <div className="h-64 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <p className="text-center text-texto/40 text-sm">Carregando...</p>
        ) : mensagens.length === 0 ? (
          <p className="text-center text-texto/40 text-sm">Nenhuma mensagem ainda.</p>
        ) : (
          mensagens.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 flex ${msg.remetente === 'revendedora' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-2 rounded-xl text-sm ${
                  msg.remetente === 'revendedora'
                    ? 'bg-primaria text-white'
                    : 'bg-white border border-gray-200 text-texto'
                }`}
              >
                {msg.texto}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={enviarMensagem} className="p-3 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primaria"
        />
        <button
          type="submit"
          className="p-2 bg-primaria text-white rounded-lg hover:bg-primaria/90 transition"
        >
          <PaperPlaneTilt size={20} />
        </button>
      </form>
    </div>
  );
}
