import { useEffect, useState } from 'react';
import { X, ArrowDown, Clock } from 'phosphor-react';
import api from '../services/api';

export default function StockModal({ produto, onClose, onUpdate }) {
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [modo, setModo] = useState(produto.acao);

  useEffect(() => {
    if (modo === 'historico') {
      api.get(`/produtos/${produto._id}/movimentacoes`)
        .then(({ data }) => setMovimentacoes(data))
        .catch(() => setMovimentacoes([]));
    }
  }, [modo, produto._id]);

  const handleBaixa = async () => {
    if (quantidade < 1) return;
    try {
      await api.post(`/produtos/${produto._id}/baixa`, { quantidade, motivo });
      onUpdate();
      onClose();
    } catch (err) {
      alert('Erro ao dar baixa no estoque.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-texto/50 hover:text-texto">
          <X size={24} />
        </button>

        <h2 className="font-titulo text-2xl text-primaria mb-4">
          {modo === 'baixa' ? 'Dar baixa no estoque' : 'Histórico de movimentações'}
        </h2>

        {modo === 'baixa' ? (
          <div className="space-y-4">
            <p className="text-sm text-texto/70">
              Produto: <strong>{produto.nome}</strong> – Estoque atual: {produto.estoque}
            </p>
            <div>
              <label className="block text-sm font-semibold mb-1">Quantidade a retirar</label>
              <input
                type="number"
                min="1"
                max={produto.estoque}
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Motivo (opcional)</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex.: venda, quebra, amostra..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
              />
            </div>
            <button
              onClick={handleBaixa}
              disabled={quantidade > produto.estoque}
              className="w-full bg-primaria text-white py-2 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ArrowDown size={18} /> Confirmar baixa
            </button>
          </div>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {movimentacoes.length === 0 ? (
              <p className="text-center text-texto/50 py-4">Nenhuma movimentação registrada.</p>
            ) : (
              <ul className="space-y-3">
                {movimentacoes.map((mov) => (
                  <li key={mov._id} className="flex items-start gap-3 border-b border-gray-100 pb-2">
                    <Clock size={20} className="text-texto/40 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">
                        {mov.tipo === 'entrada' ? '+' : '-'}{mov.quantidade} un. - {mov.motivo || 'Sem motivo'}
                      </p>
                      <p className="text-xs text-texto/50">{new Date(mov.criadoEm).toLocaleString('pt-BR')}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setModo('baixa')}
              className="mt-4 text-primaria font-semibold text-sm underline"
            >
              Voltar para baixa de estoque
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
