import { useState } from 'react';
import { X, Copy } from 'phosphor-react';
import toast from 'react-hot-toast';

export default function PixModal({ isOpen, qrCodeBase64, qrCodeText, onClose }) {
  const [pago, setPago] = useState(false);

  if (!isOpen || !qrCodeBase64) return null;

  const copiarPix = () => {
    navigator.clipboard.writeText(qrCodeText);
    toast.success('Código Pix copiado!');
    // Simula confirmação: em produção, o webhook fecha o modal; aqui damos feedback
    setPago(true);
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative text-center animate-pop">
        <button onClick={onClose} className="absolute top-4 right-4 text-texto/40 hover:text-texto">
          <X size={24} />
        </button>
        {pago ? (
          <div className="py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-titulo text-xl text-primaria mb-2">Pagamento confirmado!</h3>
            <p className="text-texto/50">Assim que o pagamento for aprovado, a loja será notificada.</p>
          </div>
        ) : (
          <>
            <h2 className="font-titulo text-2xl text-primaria mb-4">Pagamento via Pix</h2>
            <p className="text-sm text-texto/50 mb-6">Escaneie o QR Code ou copie o código abaixo.</p>
            
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block">
              <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48" />
            </div>

            <div className="mt-4 flex gap-2 justify-center">
              <button onClick={copiarPix} className="bg-primaria text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primaria/90 active:scale-95 transition-all">
                <Copy size={18} /> Copiar código
              </button>
            </div>
            
            <p className="text-xs text-texto/40 mt-6">Após o pagamento, a loja será avisada automaticamente.</p>
          </>
        )}
      </div>
    </div>
  );
}
