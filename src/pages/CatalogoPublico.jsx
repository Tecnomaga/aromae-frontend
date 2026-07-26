import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share as ShareIcon, WhatsappLogo, InstagramLogo, Link as LinkIcon, Package, Storefront, Plus, ShoppingCart, CreditCard } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import PixModal from '../components/PixModal';
import EnderecoModal from '../components/EnderecoModal';

export default function CatalogoPublico() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loja, setLoja] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [whatsAppModal, setWhatsAppModal] = useState(null);
  const [pixModal, setPixModal] = useState(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [enderecoModalAberto, setEnderecoModalAberto] = useState(false);

  useEffect(() => {
    api.get(`/catalogo/${slug}`)
      .then(({ data }) => {
        setLoja(data.loja);
        setProdutos(data.produtos);
        console.log('🧾 Plano da loja:', data.loja?.plano);
      })
      .catch(() => setErro('Loja não encontrada ou está pausada.'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const cart = localStorage.getItem(`cart_${slug}`);
    if (cart) setCarrinho(JSON.parse(cart));
  }, [slug]);

  const adicionarAoCarrinho = (produto) => {
    const novosItens = [...carrinho, produto];
    setCarrinho(novosItens);
    localStorage.setItem(`cart_${slug}`, JSON.stringify(novosItens));
    toast.success(`${produto.nome} adicionado à lista!`);
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem(`cart_${slug}`);
  };

  const gerarMensagemCarrinho = () => {
    if (carrinho.length === 0) return '';
    let texto = `Olá! Tenho interesse nos seguintes perfumes:\n\n`;
    carrinho.forEach((p, i) => {
      texto += `${i+1}. ${p.nome} (Ref: ${p._id.slice(-6)}) - R$ ${p.preco?.toFixed(2) || '0.00'}\n`;
    });
    return texto;
  };

  const compartilhar = () => {
    const url = window.location.href;
    if (navigator.share) { navigator.share({ title: loja?.nomeLoja, url }); } 
    else { navigator.clipboard.writeText(url); toast.success('Link copiado!'); }
  };

  const gerarMensagemWhatsApp = (produto) => {
    const texto = `Olá! Tenho interesse no *${produto.nome}* (Ref: ${produto._id.slice(-6)}). Pode me ajudar?`;
    const numero = loja?.telefone || '';
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  };

  const abrirModalEndereco = (produto) => {
    setProdutoSelecionado(produto);
    setEnderecoModalAberto(true);
  };

  const handleComprarAgora = async (dadosCliente) => {
    setEnderecoModalAberto(false);
    setPixLoading(true);
    try {
      const response = await api.post(`/checkout/pix/${produtoSelecionado._id}`, {
        revendedoraId: loja._id,
        nome: dadosCliente.nome,
        telefone: dadosCliente.telefone,
        endereco: dadosCliente.endereco
      });
      setPixModal({
        qrCodeBase64: response.data.qrCodeBase64,
        qrCodeText: response.data.qrCode,
        produto: produtoSelecionado
      });
    } catch (error) {
      console.error('🔥 Erro ao gerar Pix:', error.response?.data || error.message);
      const mensagem = error.response?.data?.message || 'Erro ao gerar Pix. Tente novamente.';
      toast.error(mensagem);
    } finally {
      setPixLoading(false);
      setProdutoSelecionado(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-fundo flex items-center justify-center">Carregando vitrine...</div>;
  if (erro) return (
    <div className="min-h-screen bg-fundo flex flex-col items-center justify-center p-4">
      <Storefront size={64} className="text-texto/20 mb-4" />
      <p className="text-lg text-texto/60 text-center">{erro}</p>
      <button onClick={() => navigate('/')} className="mt-4 text-primaria font-semibold">Voltar para o início</button>
    </div>
  );

  const isPremiumOrPro = loja && loja.plano && (loja.plano === 'pro' || loja.plano === 'premium');

  return (
    <div className="min-h-screen bg-fundo font-corpo pb-32">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-texto/60 hover:text-texto"><ArrowLeft size={24} /></button>
          {loja?.fotoPerfil ? (<img src={loja.fotoPerfil} alt={loja.nomeLoja} className="w-12 h-12 rounded-full object-cover" />) : 
            (<div className="w-12 h-12 rounded-full bg-primaria/10 flex items-center justify-center text-primaria font-titulo text-xl">{loja?.nomeLoja?.charAt(0) || 'A'}</div>)}
          <div className="flex-1">
            <h1 className="font-titulo text-2xl text-primaria">{loja?.nomeLoja}</h1>
            <div className="flex items-center gap-2 text-xs text-texto/50">
              <span className={`w-2 h-2 rounded-full ${loja?.ativo ? 'bg-sucesso' : 'bg-gray-400'}`}></span>
              {loja?.ativo ? 'Loja aberta' : 'Em pausa'}
            </div>
          </div>
          <button onClick={compartilhar} className="text-texto/70 hover:text-primaria"><ShareIcon size={24} /></button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {produtos.length === 0 ? (
          <div className="text-center py-20"><Package size={64} className="mx-auto text-texto/20 mb-4" /><p className="text-texto/60 text-lg">Esta loja ainda não tem produtos.</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {produtos.map((produto) => (
              <div key={produto._id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col relative group">
                <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                  {produto.fotos?.[0] ? (<img src={produto.fotos[0]} alt={produto.nome} className="w-full h-full object-cover" />) : 
                    (<Package size={48} className="text-texto/20" />)}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {produto.etiquetas?.map((etiqueta, idx) => {
                      let bgClass = 'bg-primaria text-white';
                      if (etiqueta === 'Mais vendido') bgClass = 'bg-secundaria text-white';
                      if (etiqueta === 'Promoção') bgClass = 'bg-red-500 text-white';
                      if (etiqueta === 'Edição limitada') bgClass = 'bg-purple-500 text-white';
                      if (etiqueta === 'Novidade') bgClass = 'bg-green-500 text-white';
                      if (etiqueta === 'Lançamento') bgClass = 'bg-blue-500 text-white';
                      return (<span key={idx} className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${bgClass}`}>{etiqueta}</span>);
                    })}
                  </div>
                  <button onClick={() => adicionarAoCarrinho(produto)} className="absolute bottom-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-primaria hover:text-white transition"><Plus size={18} /></button>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm line-clamp-2">{produto.nome}</h3>
                  <p className="text-xs text-texto/50 mt-1">{produto.marca}</p>
                  <p className="text-primaria font-bold text-lg mt-2">
                    R$ {produto.preco ? produto.preco.toFixed(2) : '0.00'}
                  </p>
                  <button onClick={() => setWhatsAppModal(produto)} className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 hover:bg-green-600 transition"><WhatsappLogo size={18} weight="fill" /> Pedir</button>
                  
                  {isPremiumOrPro && (
                    <button 
                      onClick={() => abrirModalEndereco(produto)} 
                      disabled={pixLoading}
                      className="mt-2 w-full bg-primaria text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 hover:bg-primaria/90 transition"
                    >
                      <CreditCard size={18} /> Comprar (Pix)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={compartilhar} className="flex flex-col items-center text-texto/70 hover:text-primaria"><LinkIcon size={20} /><span className="text-[10px]">Link</span></button>
            <button onClick={() => { if (carrinho.length > 0) { window.open(`https://wa.me/${loja?.telefone}?text=${encodeURIComponent(gerarMensagemCarrinho())}`, '_blank'); } else { toast('Adicione itens à lista!'); } }} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition ${carrinho.length > 0 ? 'bg-primaria text-white hover:bg-primaria/90' : 'bg-gray-100 text-gray-400'}`}><ShoppingCart size={18} /> Enviar lista ({carrinho.length})</button>
          </div>
          <div className="flex gap-4">
            <button onClick={compartilhar} className="flex flex-col items-center text-texto/70 hover:text-primaria"><InstagramLogo size={20} /><span className="text-[10px]">IG</span></button>
            {carrinho.length > 0 && (<button onClick={limparCarrinho} className="text-xs text-red-500 underline">Limpar</button>)}
          </div>
        </div>
      </footer>

      {whatsAppModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-pop">
            <h3 className="font-titulo text-xl text-primaria mb-2">Confirmar pedido</h3>
            <p className="text-sm text-texto/70 mb-4">Pedir <strong>{whatsAppModal.nome}</strong> via WhatsApp?</p>
            <div className="flex gap-3">
              <button onClick={() => setWhatsAppModal(null)} className="flex-1 py-2 border border-gray-200 rounded-lg font-semibold text-texto hover:bg-gray-50">Cancelar</button>
              <a href={gerarMensagemWhatsApp(whatsAppModal)} target="_blank" rel="noopener noreferrer" onClick={() => setWhatsAppModal(null)} className="flex-1 py-2 bg-green-500 text-white rounded-lg font-semibold text-center hover:bg-green-600 transition">Ir</a>
            </div>
          </div>
        </div>
      )}

      {pixModal && (
        <PixModal
          qrCodeBase64={pixModal.qrCodeBase64}
          qrCodeText={pixModal.qrCodeText}
          onClose={() => setPixModal(null)}
        />
      )}

      <EnderecoModal
        isOpen={enderecoModalAberto}
        onClose={() => setEnderecoModalAberto(false)}
        onConfirm={handleComprarAgora}
      />
    </div>
  );
}
