import { useState } from 'react';
import { X } from 'phosphor-react';

export default function EnderecoModal({ isOpen, onClose, onConfirm }) {
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleConfirm = () => {
    if (form.nome.trim().length < 2) {
      alert('Por favor, preencha seu nome.');
      return;
    }
    if (form.telefone.trim().length < 10) {
      alert('Por favor, informe um telefone válido com DDD.');
      return;
    }
    if (form.endereco.trim().length < 5) {
      alert('Por favor, preencha seu endereço completo.');
      return;
    }

    console.log('📦 Dados do cliente enviados:', form);
    // ✅ Chama a função de confirmação e passa os dados
    onConfirm(form);
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
          <p className="text-sm text-texto/60 mb-2">
            Preencha seus dados para que a revendedora possa entrar em contato e entregar o produto.
          </p>
          <div>
            <label className="block text-sm font-semibold text-texto/60 mb-1">Seu nome *</label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Maria Silva"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria focus:ring-2 focus:ring-primaria/20 transition-all"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria focus:ring-2 focus:ring-primaria/20 transition-all"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria focus:ring-2 focus:ring-primaria/20 transition-all"
            />
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
