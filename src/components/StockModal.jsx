import { useEffect, useState } from 'react';
import { X, ArrowDown, ArrowUp, Clock } from 'phosphor-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function StockModal({ produto, onClose, onUpdate }) {
  const [quantidade, setQuantidade] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [modo, setModo] = useState(produto.acao || 'baixa');
  const [tipoAcao, setTipoAcao] = useState('saida');

  useEffect(() => {
    if (modo === 'historico') {
      api.get(`/produtos/${produto._id}/movimentacoes`)
        .then(({ data }) => setMovimentacoes(data))
        .catch(() => setMovimentacoes([]));
    }
  }, [modo, produto._id]);

  const handleAcao = async () => {
    if (quantidade < 1) return;
    try {
      await toast.promise(
        api.post(`/produtos/${produto._id}/movimentacao`, { quantidade, motivo, tipo: tipoAcao }),
        { loading: 'Processando...', success: 'Estoque atualizado!', error: 'Erro na operação.' }
      );
      onUpdate();
      onClose();
    } catch (err) {}
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-texto/40 hover:text-texto transition-colors"
        >
          <X size={24} weight="bold" />
        </button>

        <h2 className="font-titulo text-2xl text-primaria mb-2">
          {modo === 'baixa' ? 'Ajustar Estoque' : 'Histórico'}
        </h2>
        <p className="text-sm text-texto/50 mb-6">
          {modo === 'baixa' ? `Produto: ${produto.nome} – Estoque atual: ${produto.estoque} un.` : 'Movimentações recentes'}
        </p>

        {modo === 'historico' ? (
          <div>
            <div className="max-h-60 overflow-y-auto pr-2">
              {movimentacoes.length === 0 ? (
                <p className="text-center text-texto/40 py-8 text-sm">Nenhuma movimentação registrada.</p>
              ) : (
                <ul className="space-y-3">
                  {movimentacoes.map((mov) => (
                    <li key={mov._id} className="flex items-start gap-3 border-b border-gray-100 pb-3">
                      <Clock size={18} className="text-texto/30 mt-0.5 shrink-0" />
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-semibold">
                            <span className={mov.tipo === 'entrada' ? 'text-sucesso' : 'text-red-500'}>
                              {mov.tipo === 'entrada' ? '+' : '-'}{mov.quantidade}
                            </span> un.
                          </p>
                          <span className="text-xs text-texto/40">
                            {new Date(mov.criadoEm).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-xs text-texto/50">{mov.motivo || 'Sem motivo'}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => setModo('baixa')}
                className="mt-4 text-primaria font-semibold text-sm underline hover:text-primaria/80 transition"
              >
                ← Voltar para ajuste
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setTipoAcao('saida')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  tipoAcao === 'saida' 
                    ? 'bg-white shadow-md text-red-500' 
                    : 'text-texto/60 hover:text-texto'
                }`}
              >
                <ArrowDown size={18} weight="bold" /> Saída
              </button>
              <button
                onClick={() => setTipoAcao('entrada')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                  tipoAcao === 'entrada' 
                    ? 'bg-white shadow-md text-sucesso' 
                    : 'text-texto/60 hover:text-texto'
                }`}
              >
                <ArrowUp size={18} weight="bold" /> Entrada
              </button>
            </div>

            <div>
              <label className="input-label">Quantidade</label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="input-field"
              />
            </div>

            <div>
              <label className="input-label">Motivo (opcional)</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ex.: venda, quebra, compra..."
                className="input-field"
              />
            </div>

            <button
              onClick={handleAcao}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {tipoAcao === 'saida' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
