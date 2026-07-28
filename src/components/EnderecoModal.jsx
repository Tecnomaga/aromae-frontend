import { useState, useEffect } from 'react';
import { X, Tag, CheckCircle } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function EnderecoModal({ isOpen, onClose, onConfirm, valorOriginal, revendedoraId }) {
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '' });
  const [cupomCodigo, setCupomCodigo] = useState('');
  const [cupom, setCupom] = useState(null);
  const [loadingCupom, setLoadingCupom] = useState(false);
  const [total, setTotal] = useState(0);

  // Sincroniza o total com o valorOriginal sempre que o modal abrir ou a prop mudar
  useEffect(() => {
    if (isOpen && valorOriginal) {
      setTotal(Number(valorOriginal));
      setCupom(null);
      setCupomCodigo('');
    }
  }, [isOpen, valorOriginal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAplicarCupom = async () => {
    if (!cupomCodigo.trim()) {
      toast.error('Digite um código de cupom');
      return;
    }
    if (!revendedoraId) {
      toast.error('Erro interno: ID da loja não informado.');
      return;
    }
    setLoadingCupom(true);
    try {
      const response = await api.post('/cupons/validar', {
        codigo: cupomCodigo,
        revendedoraId: revendedoraId
      });
      setCupom(response.data);
      const desconto = response.data.tipo === 'percentual'
        ? Number(valorOriginal) * (response.data.desconto / 100)
        : response.data.desconto;
      setTotal(Math.max(0, Number(valorOriginal) - desconto));
      toast.success('Cupom aplicado!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cupom inválido');
      setCupom(null);
      setTotal(Number(valorOriginal));
    } finally {
      setLoadingCupom(false);
    }
  };

  const handleConfirm = () => {
    if (!form.nome.trim() || !form.telefone.trim() || !form.endereco.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    onConfirm({
      ...form,
      cupom: cupomCodigo,
      total
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-pop">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-titulo text-xl text-primaria">Finalizar compra</h3>
          <button onClick={onClose} className="text-texto/40 hover:text-texto p-1">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-texto/60 mb-1">Seu nome *</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Maria Silva"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-texto/60 mb-1">Telefone (com DDD) *</label>
            <input
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-texto/60 mb-1">Endereço para entrega *</label>
            <input
              type="text"
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade e CEP"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria"
            />
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <label className="block text-sm font-semibold text-texto/60 mb-2">Cupom de desconto</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Tag size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/30" />
                <input
                  type="text"
                  value={cupomCodigo}
                  onChange={(e) => setCupomCodigo(e.target.value.toUpperCase())}
                  placeholder="Ex: BEMVINDO10"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria"
                />
              </div>
              <button
                onClick={handleAplicarCupom}
                disabled={loadingCupom || !cupomCodigo.trim()}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  loadingCupom ? 'bg-gray-200 text-gray-400' : 'bg-primaria text-white hover:bg-primaria/90'
                }`}
              >
                {loadingCupom ? '...' : 'Aplicar'}
              </button>
            </div>
            {cupom && (
              <div className="mt-2 flex items-center gap-2 text-sm text-sucesso">
                <CheckCircle size={16} weight="fill" />
                Cupom aplicado!
              </div>
            )}
            <div className="mt-3 flex justify-between text-sm font-semibold">
              <span className="text-texto/60">Total</span>
              <span className="text-primaria text-lg">
                R$ {typeof total === 'number' ? total.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-texto/70 hover:text-texto transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 rounded-xl bg-primaria text-white font-semibold text-sm hover:bg-primaria/90 transition shadow-sm"
          >
            Confirmar e pagar
          </button>
        </div>
      </div>
    </div>
  );
}
