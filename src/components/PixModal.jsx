import { useState } from 'react';
import { X, Copy, CheckCircle, Spinner, WhatsappLogo } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PixModal({ isOpen, qrCodeBase64, qrCodeText, onClose, paymentId, lojaWhatsapp }) {
  const [pago, setPago] = useState(false);
  const [consultando, setConsultando] = useState(false);
  const [pedidoDetalhes, setPedidoDetalhes] = useState(null);

  if (!isOpen || !qrCodeBase64) return null;

  const copiarPix = () => {
    navigator.clipboard.writeText(qrCodeText);
    toast.success('Código Pix copiado!');
  };

  const verificarPagamento = async () => {
    if (!paymentId) return;
    setConsultando(true);
    try {
      const { data } = await api.get(`/checkout/status/${paymentId}`);
      if (data.status === 'approved') {
        setPedidoDetalhes(data.pedido);
        setPago(true);
        toast.success('Pagamento confirmado!');
      } else {
        toast('Pagamento ainda não confirmado. Tente novamente em alguns instantes.', { icon: '⏳' });
      }
    } catch {
      toast.error('Erro ao verificar pagamento.');
    } finally {
      setConsultando(false);
    }
  };

  const mensagemWhatsApp = lojaWhatsapp && pedidoDetalhes
    ? `Olá! Acabei de fazer um pedido no valor de R$ ${pedidoDetalhes.total.toFixed(2)} e gostaria de confirmar a entrega.`
    : '';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative text-center animate-pop">
        <button onClick={onClose} className="absolute top-4 right-4 text-texto/40 hover:text-texto">
          <X size={24} />
        </button>

        {pago && pedidoDetalhes ? (
          <div className="py-4">
            <CheckCircle size={64} className="mx-auto text-sucesso mb-4" weight="fill" />
            <h3 className="font-titulo text-xl text-primaria mb-2">Pagamento confirmado!</h3>
            <p className="text-texto/50 mb-4">Seu pedido foi aprovado e a loja já foi notificada.</p>
            <div className="bg-fundo rounded-xl p-4 text-left space-y-2 mb-6">
              <p className="text-sm"><strong>Produto:</strong> {pedidoDetalhes.itens?.[0]?.produto?.nome || 'Produto'}</p>
              <p className="text-sm"><strong>Total:</strong> R$ {pedidoDetalhes.total.toFixed(2)}</p>
              <p className="text-sm"><strong>Endereço:</strong> {pedidoDetalhes.endereco || 'Não informado'}</p>
            </div>
            {lojaWhatsapp && (
              <a
                href={`https://wa.me/${lojaWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagemWhatsApp)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-green-600 transition"
              >
                <WhatsappLogo size={20} weight="fill" /> Falar com a loja
              </a>
            )}
            <button
              onClick={onClose}
              className="mt-4 block w-full bg-gray-100 text-texto py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-titulo text-2xl text-primaria mb-4">Pagamento via Pix</h2>
            <p className="text-sm text-texto/50 mb-6">
              Escaneie o QR Code ou copie o código. Após pagar, clique em "Já paguei".
            </p>
            
            <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 inline-block">
              <img src={`data:image/png;base64,${qrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48" />
            </div>

            <div className="mt-4 flex flex-col gap-3 justify-center items-center">
              <button onClick={copiarPix} className="bg-primaria text-white px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primaria/90 active:scale-95 transition-all">
                <Copy size={18} /> Copiar código
              </button>
              <button 
                onClick={verificarPagamento}
                disabled={consultando}
                className="bg-sucesso text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-sucesso/90 transition flex items-center gap-2 disabled:opacity-50"
              >
                {consultando && <Spinner size={18} className="animate-spin" />}
                Já paguei
              </button>
            </div>
            
            <p className="text-xs text-texto/40 mt-6">O pagamento é processado pelo Mercado Pago.</p>
          </>
        )}
      </div>
    </div>
  );
}
