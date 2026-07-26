import { useState } from 'react';
import { X } from 'phosphor-react';

export default function EnderecoModal({ isOpen, onClose, onConfirm }) {
  const [endereco, setEndereco] = useState('');

  const handleConfirm = () => {
    if (endereco.trim().length < 5) {
      alert('Por favor, informe um endereço válido.');
      return;
    }
    onConfirm(endereco);
    setEndereco('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-pop">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-titulo text-xl text-primaria">Informe seu endereço</h3>
          <button onClick={onClose} className="text-texto/40 hover:text-texto p-1">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-texto/60 mb-4">
            Preencha o endereço onde deseja receber o produto. A revendedora entrará em contato para confirmar a entrega.
          </p>
          <input
            type="text"
            placeholder="Rua, número, bairro, cidade e CEP"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria focus:ring-2 focus:ring-primaria/20 transition-all"
            autoFocus
          />
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
