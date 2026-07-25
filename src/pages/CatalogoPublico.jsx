import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share as ShareIcon, WhatsappLogo, InstagramLogo, Link as LinkIcon, Package, Storefront } from 'phosphor-react';
import api from '../services/api';

export default function CatalogoPublico() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loja, setLoja] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [whatsAppModal, setWhatsAppModal] = useState(null);

  useEffect(() => {
    api.get(`/catalogo/${slug}`)
      .then(({ data }) => {
        setLoja(data.loja);
        setProdutos(data.produtos);
      })
      .catch(() => setErro('Loja não encontrada ou está pausada.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const compartilhar = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: loja?.nomeLoja, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado!');
    }
  };

  const gerarMensagemWhatsApp = (produto) => {
    const texto = `Olá! Tenho interesse no *${produto.nome}* (Ref: ${produto._id.slice(-6)}). Pode me ajudar?`;
    const numero = loja?.telefone || '';
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  };

  if (loading) return <div className="min-h-screen bg-fundo flex items-center justify-center">Carregando vitrine...</div>;
  if (erro) return (
    <div className="min-h-screen bg-fundo flex flex-col items-center justify-center p-4">
      <Storefront size={64} className="text-texto/20 mb-4" />
      <p className="text-lg text-texto/60 text-center">{erro}</p>
      <button onClick={() => navigate('/')} className="mt-4 text-primaria font-semibold">Voltar para o início</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-fundo font-corpo">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-texto/60 hover:text-texto">
            <ArrowLeft size={24} />
          </button>
          {loja?.fotoPerfil ? (
            <img src={loja.fotoPerfil} alt={loja.nomeLoja} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primaria/10 flex items-center justify-center text-primaria font-titulo text-xl">
              {loja?.nomeLoja?.charAt(0) || 'A'}
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-titulo text-2xl text-primaria">{loja?.nomeLoja}</h1>
            <div className="flex items-center gap-2 text-xs text-texto/50">
              <span className={`w-2 h-2 rounded-full ${loja?.ativo ? 'bg-sucesso' : 'bg-gray-400'}`}></span>
              {loja?.ativo ? 'Loja aberta' : 'Em pausa'}
            </div>
          </div>
          <button onClick={compartilhar} className="text-texto/70 hover:text-primaria">
            <ShareIcon size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {produtos.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-texto/20 mb-4" />
            <p className="text-texto/60 text-lg">Esta loja ainda não tem produtos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {produtos.map((produto) => (
              <div key={produto._id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {produto.fotos?.[0] ? (
                    <img src={produto.fotos[0]} alt={produto.nome} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={48} className="text-texto/20" />
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm line-clamp-2">{produto.nome}</h3>
                  <p className="text-xs text-texto/50 mt-1">{produto.marca}</p>
                  <p className="text-primaria font-bold text-lg mt-2">R$ {produto.preco?.toFixed(2)}</p>
                  <button
                    onClick={() => setWhatsAppModal(produto)}
                    className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 hover:bg-green-600 transition"
                  >
                    <WhatsappLogo size={18} weight="fill" /> Pedir via WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4 flex justify-center gap-6 z-10">
        <button onClick={compartilhar} className="flex flex-col items-center text-texto/70 hover:text-primaria">
          <LinkIcon size={24} />
          <span className="text-xs">Copiar link</span>
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Veja minha loja de perfumes: ${window.location.href}`)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center text-texto/70 hover:text-primaria"
        >
          <WhatsappLogo size={24} />
          <span className="text-xs">Compartilhar</span>
        </a>
        <button onClick={compartilhar} className="flex flex-col items-center text-texto/70 hover:text-primaria">
          <InstagramLogo size={24} />
          <span className="text-xs">Instagram</span>
        </button>
      </footer>

      {/* Modal de confirmação WhatsApp */}
      {whatsAppModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-pop">
            <h3 className="font-titulo text-xl text-primaria mb-2">Confirmar pedido</h3>
            <p className="text-sm text-texto/70 mb-4">
              Você será direcionado ao WhatsApp para pedir <strong>{whatsAppModal.nome}</strong>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setWhatsAppModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg font-semibold text-texto hover:bg-gray-50">
                Cancelar
              </button>
              <a
                href={gerarMensagemWhatsApp(whatsAppModal)}
                target="_blank" rel="noopener noreferrer"
                onClick={() => setWhatsAppModal(null)}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold text-center hover:bg-green-600 transition"
              >
                Ir para WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
