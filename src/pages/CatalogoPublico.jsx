import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share as ShareIcon, WhatsappLogo, InstagramLogo, Link as LinkIcon, Package, Storefront, Plus, ShoppingCart, CreditCard, MagnifyingGlass } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import PixModal from '../components/PixModal';
import EnderecoModal from '../components/EnderecoModal';
import DetalhesProdutoModal from '../components/DetalhesProdutoModal';

const LIMIT = 12;

export default function CatalogoPublico() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loja, setLoja] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [busca, setBusca] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [erro, setErro] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [whatsAppModal, setWhatsAppModal] = useState(null);
  const [pixModal, setPixModal] = useState(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [enderecoModalAberto, setEnderecoModalAberto] = useState(false);
  const [detalhesModalAberto, setDetalhesModalAberto] = useState(false);
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [termoBusca, setTermoBusca] = useState('');

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

  const carregarProdutos = useCallback(async (pageNum = 1, reset = false, termo = termoBusca, ord = ordenacao) => {
    if (reset) {
      setLoading(true);
      setProdutos([]);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = { ordenacao: ord };
      if (termo) params.busca = termo;
      if (pageNum && LIMIT) {
        params.page = pageNum;
        params.limit = LIMIT;
      }

      const { data } = await api.get(`/catalogo/${slug}`, { params });
      if (reset) {
        setLoja(data.loja);
        setProdutos(data.produtos);
      } else {
        setProdutos(prev => [...prev, ...data.produtos]);
      }
      setHasMore(data.produtos.length === LIMIT);
      setPage(pageNum);
    } catch {
      if (reset) setErro('Loja não encontrada ou está pausada.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug, termoBusca, ordenacao]);

  useEffect(() => { carregarProdutos(1, true); }, [carregarProdutos]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!hasMore || loading || loadingMore) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        carregarProdutos(page + 1, false);
      }
    }, { threshold: 0.1 });
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, carregarProdutos]);

  const handleBuscaSubmit = (e) => { e.preventDefault(); setTermoBusca(busca); };

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

  const limparCarrinho = () => { setCarrinho([]); localStorage.removeItem(`cart_${slug}`); };

  const gerarMensagemCarrinho = () => {
    if (carrinho.length === 0) return '';
    let texto = `Olá! Tenho interesse nos seguintes perfumes:\n\n`;
    carrinho.forEach((p, i) => { texto += `${i+1}. ${p.nome} (Ref: ${p._id.slice(-6)}) - R$ ${p.preco?.toFixed(2) || '0.00'}\n`; });
    return texto;
  };

  const compartilhar = () => {
    const url = window.location.href;
    if (navigator.share) { navigator.share({ title: loja?.nomeLoja, url }); }
    else { navigator.clipboard.writeText(url); toast.success('Link copiado!'); }
  };

  const gerarMensagemWhatsApp = (produto) => {
    const texto = `Olá! Tenho interesse no *${produto.nome}* (Ref: ${produto._id.slice(-6)}). Pode me ajudar?`;
    const numero = loja?.telefone?.replace(/\D/g, '') || '';
    if (!numero) { toast.error('Esta loja ainda não cadastrou um número de WhatsApp.'); return '#'; }
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
        endereco: dadosCliente.endereco,
        cupom: dadosCliente.cupom || '',
        total: dadosCliente.total || Number(produtoSelecionado.preco)
      });

      sessionStorage.setItem('pendingPixOrder', JSON.stringify({
        revendedoraId: loja._id,
        produtoId: produtoSelecionado._id,
        produtoNome: produtoSelecionado.nome,
        revendedoraWhatsApp: loja?.telefone,
        nome: dadosCliente.nome,
        telefone: dadosCliente.telefone,
        endereco: dadosCliente.endereco,
        paymentId: response.data.paymentId
      }));

      setPixModal({
        isOpen: true,
        qrCodeBase64: response.data.qrCodeBase64,
        qrCodeText: response.data.qrCode,
        paymentId: response.data.paymentId,
        produto: produtoSelecionado
      });

    } catch (error) {
      console.error('🔥 Erro ao gerar Pix:', error);
      let mensagem = 'Erro ao gerar Pix. Tente novamente.';
      if (error.response && error.response.data) mensagem = error.response.data.message || mensagem;
      else if (error.request) mensagem = 'Erro de conexão com o servidor.';
      toast.error(mensagem);
    } finally {
      setPixLoading(false);
    }
  };

  const abrirDetalhes = (produto) => { setProdutoSelecionado(produto); setDetalhesModalAberto(true); };

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
          <div className="flex items-center gap-2">
            <select value={ordenacao} onChange={(e) => { setOrdenacao(e.target.value); carregarProdutos(1, true, busca, e.target.value); }} className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white">
              <option value="recentes">Mais recentes</option>
              <option value="menor_preco">Menor preço</option>
              <option value="maior_preco">Maior preço</option>
            </select>
            <button onClick={compartilhar} className="text-texto/70 hover:text-primaria"><ShareIcon size={24} /></button>
          </div>
        </div>
        <form onSubmit={handleBuscaSubmit} className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto/30" />
            <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar perfume ou marca..." className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primaria bg-white" />
          </div>
        </form>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {produtos.length === 0 ? (
          <div className="text-center py-20"><Package size={64} className="mx-auto text-texto/20 mb-4" /><p className="text-texto/60 text-lg">Nenhum produto encontrado.</p></div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtos.map((produto) => (
                <div key={produto._id} className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col relative group">
                  <div className="h-40 bg-gray-100 flex items-center justify-center relative">
                    <button onClick={() => abrirDetalhes(produto)} className="w-full h-full">
                      {produto.fotos?.[0] ? (
                        <img src={produto.fotos[0]} alt={produto.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primaria/5 to-secundaria/10 gap-1">
                          <span className="text-4xl">🌸</span>
                          <span className="text-xs text-texto/30 font-medium">Sem foto</span>
                        </div>
                      )}
                    </button>
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
                    <button onClick={() => abrirDetalhes(produto)} className="text-left hover:underline">
                      <h3 className="font-bold text-sm line-clamp-2">{produto.nome}</h3>
                    </button>
                    <p className="text-xs text-texto/50 mt-1">{produto.marca}</p>
                    <p className="text-primaria font-bold text-lg mt-2">R$ {Number(produto.preco).toFixed(2)}</p>
                    <button onClick={() => { const url = gerarMensagemWhatsApp(produto); if (url !== '#') window.open(url, '_blank'); }} className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 hover:bg-green-600 transition">
                      <WhatsappLogo size={18} weight="fill" /> Pedir
                    </button>
                    {isPremiumOrPro && (
                      <button onClick={() => abrirModalEndereco(produto)} disabled={pixLoading} className="mt-2 w-full bg-primaria text-white py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-1 hover:bg-primaria/90 transition">
                        <CreditCard size={18} /> Comprar (Pix)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {hasMore && <div ref={sentinelRef} className="h-4" />}
            {loadingMore && (<div className="flex justify-center py-4"><div className="w-8 h-8 rounded-full border-4 border-primaria/20 border-t-primaria animate-spin" /></div>)}
          </>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-4 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={compartilhar} className="flex flex-col items-center text-texto/70 hover:text-primaria"><LinkIcon size={20} /><span className="text-[10px]">Link</span></button>
            <button onClick={() => { if (carrinho.length > 0) { window.open(`https://wa.me/${loja?.telefone?.replace(/\D/g, '')}?text=${encodeURIComponent(gerarMensagemCarrinho())}`, '_blank'); } else { toast('Adicione itens à lista!'); } }} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition ${carrinho.length > 0 ? 'bg-primaria text-white hover:bg-primaria/90' : 'bg-gray-100 text-gray-400'}`}><ShoppingCart size={18} /> Enviar lista ({carrinho.length})</button>
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

      {pixModal && pixModal.isOpen && (
        <PixModal isOpen={pixModal.isOpen} qrCodeBase64={pixModal.qrCodeBase64} qrCodeText={pixModal.qrCodeText} onClose={() => setPixModal(null)} paymentId={pixModal.paymentId} lojaWhatsapp={loja?.telefone} />
      )}

      <EnderecoModal isOpen={enderecoModalAberto} onClose={() => setEnderecoModalAberto(false)} onConfirm={handleComprarAgora} valorOriginal={Number(produtoSelecionado?.preco) || 0} revendedoraId={loja?._id} />

      <DetalhesProdutoModal produto={produtoSelecionado} isOpen={detalhesModalAberto} onClose={() => setDetalhesModalAberto(false)} />
    </div>
  );
}
