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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-texto/50 hover:text-texto"><X size={24} /></button>

        <h2 className="font-titulo text-2xl text-primaria mb-4">Ajustar Estoque</h2>

        {modo === 'historico' ? (
          <div>
            <div className="max-h-60 overflow-y-auto">
              {movimentacoes.length === 0 ? <p className="text-center text-texto/50 py-4">Sem movimentações.</p> : 
                <ul className="space-y-3">
                  {movimentacoes.map((mov) => (
                    <li key={mov._id} className="flex items-start gap-3 border-b border-gray-100 pb-2">
                      <Clock size={20} className="text-texto/40 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">{mov.tipo === 'entrada' ? '+' : '-'}{mov.quantidade} un. - {mov.motivo || 'Sem motivo'}</p>
                        <p className="text-xs text-texto/50">{new Date(mov.criadoEm).toLocaleString('pt-BR')}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => setModo('baixa')} className="mt-4 text-primaria font-semibold text-sm underline">Voltar</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-texto/70">Produto: <strong>{produto.nome}</strong> – Estoque atual: {produto.estoque}</p>
            
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button onClick={() => setTipoAcao('saida')} className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition ${tipoAcao === 'saida' ? 'bg-white shadow text-red-500' : 'text-texto'}`}>
                <ArrowDown size={16} /> Baixa
              </button>
              <button onClick={() => setTipoAcao('entrada')} className={`flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 transition ${tipoAcao === 'entrada' ? 'bg-white shadow text-sucesso' : 'text-texto'}`}>
                <ArrowUp size={16} /> Reposição
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Quantidade</label>
              <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Motivo (opcional)</label>
              <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: venda, quebra, compra..." className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
            </div>
            <button onClick={handleAcao} className="w-full bg-primaria text-white py-2 rounded-lg font-semibold hover:bg-primaria/90 transition">
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
