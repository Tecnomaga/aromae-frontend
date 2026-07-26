import { useState } from 'react';
import { Tag } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CupomInput({ revendedoraId, onCupomAplicado }) {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAplicar = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/cupons/validar', { codigo, revendedoraId });
      onCupomAplicado(response.data);
      toast.success('Cupom aplicado!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cupom inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-center mt-2">
      <div className="flex-1 relative">
        <Tag size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/30" />
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Cupom de desconto"
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria"
        />
      </div>
      <button
        onClick={handleAplicar}
        disabled={loading}
        className="px-4 py-2 bg-primaria text-white rounded-xl font-semibold text-sm hover:bg-primaria/90 transition"
      >
        Aplicar
      </button>
    </div>
  );
}
