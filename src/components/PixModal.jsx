import { useState } from 'react';
import { X, Copy } from 'phosphor-react';
import toast from 'react-hot-toast';

export default function PixModal({ qrCodeBase64, qrCodeText, onClose }) {
  const copiarPix = () => {
    navigator.clipboard.writeText(qrCodeText);
    toast.success('Código Pix copiado!');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-texto/40 hover:text-texto">
          <X size={24} />
        </button>
        <h2 className="font-titulo text-2xl text-primaria mb-4">Pagamento via Pix</h2>
        <p className="text-sm text-texto/50 mb-6">Escaneie o QR Code ou copie o código abaixo.</p>
        
        <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block">
          {qrCodeBase64 ? (
            <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48" />
          ) : (
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-texto/30">Gerando...</div>
          )}
        </div>

        <div className="mt-4 flex gap-2 justify-center">
          <button onClick={copiarPix} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
            <Copy size={18} /> Copiar código
          </button>
        </div>
        
        <p className="text-xs text-texto/40 mt-6">Após o pagamento, a loja será avisada automaticamente.</p>
      </div>
    </div>
  );
}
