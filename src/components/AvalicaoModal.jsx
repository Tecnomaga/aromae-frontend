import { useState } from 'react';
import { X, Star } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AvaliacaoModal({ produtoId, revendedoraId, clienteNome, onClose, onSuccess }) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/avaliacoes', {
        produtoId,
        revendedoraId,
        clienteNome,
        nota,
        comentario
      });
      toast.success('Avaliação enviada com sucesso!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao enviar avaliação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-pop">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-titulo text-xl text-primaria">Avalie este produto</h3>
          <button onClick={onClose} className="text-texto/40 hover:text-texto">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nota</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNota(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={32}
                    weight={star <= nota ? 'fill' : 'regular'}
                    className={star <= nota ? 'text-secundaria' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Comentário</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="O que você achou do produto?"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primaria text-white py-3 rounded-xl font-semibold hover:bg-primaria/90 transition"
          >
            {loading ? 'Enviando...' : 'Enviar avaliação'}
          </button>
        </form>
      </div>
    </div>
  );
}
