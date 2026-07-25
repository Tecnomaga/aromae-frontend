import { useState } from 'react';
import { X } from 'phosphor-react';
import toast from 'react-hot-toast';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar' }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast.success('Ação concluída com sucesso!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao executar ação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-pop">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-texto/50 hover:text-texto">
            <X size={20} />
          </button>
        </div>
        <p className="text-texto/70 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 font-semibold text-texto hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Processando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
