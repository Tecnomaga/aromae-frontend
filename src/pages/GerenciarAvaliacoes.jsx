import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, X } from 'phosphor-react';
import api from '../services/api';

export default function GerenciarAvaliacoes() {
  const navigate = useNavigate();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/avaliacoes/revendedora')
      .then(({ data }) => setAvaliacoes(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando avaliações...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-titulo text-3xl text-primaria mb-6">Avaliações dos Produtos</h1>
        <button onClick={() => navigate(-1)} className="text-texto/40 hover:text-texto p-1">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-4">
        {avaliacoes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-texto/40">
            Nenhuma avaliação recebida ainda.
          </div>
        ) : (
          avaliacoes.map((av) => (
            <div key={av._id} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-texto">{av.clienteNome}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        weight={i < av.nota ? 'fill' : 'regular'}
                        className={i < av.nota ? 'text-secundaria' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-texto/70">{av.comentario || 'Sem comentário.'}</p>
                <p className="text-xs text-texto/40 mt-2">
                  {new Date(av.criadoEm).toLocaleDateString('pt-BR')} • {av.produto?.nome || 'Produto removido'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
