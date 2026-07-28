import { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, Funnel, Package, Warning, Pencil, Trash, ArrowDown, ArrowUp } from 'phosphor-react';
import api from '../services/api';
import StockModal from '../components/StockModal';
import ConfirmModal from '../components/ConfirmModal';
import Skeleton, { CardSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const LIMIT = 12;

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [estoqueModal, setEstoqueModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const carregarProdutos = useCallback(async (pageNum = 1, reset = false) => {
    if (reset) {
      setLoading(true);
      setProdutos([]);
    } else {
      setLoadingMore(true);
    }

    try {
      const { data } = await api.get('/produtos', {
        params: {
          page: pageNum,
          limit: LIMIT,
          busca: busca || undefined,
          filtro: filtro !== 'todos' ? filtro : undefined
        }
      });
      if (reset) {
        setProdutos(data);
      } else {
        setProdutos(prev => [...prev, ...data]);
      }
      setHasMore(data.length === LIMIT);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [busca, filtro]);

  useEffect(() => {
    carregarProdutos(1, true);
  }, [carregarProdutos]);

  // Scroll infinito
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/produtos/${deleteTarget}`);
    setProdutos(prev => prev.filter(p => p._id !== deleteTarget));
    setDeleteTarget(null);
  };

  const handleBaixaEstoque = (produto) => setEstoqueModal({ ...produto, acao: 'baixa' });
  const handleVerHistorico = (produto) => setEstoqueModal({ ...produto, acao: 'historico' });

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="font-titulo text-4xl text-primaria mb-1">Seus Produtos</h1>
          <p className="text-texto/50 text-sm">Gerencie seu catálogo de perfumes</p>
        </div>
        <Link to="/produtos/novo" className="btn-primary flex items-center gap-2">
          <Plus size={20} weight="bold" /> Novo Produto
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto/30" />
          <input
            type="text"
            placeholder="Buscar por nome ou marca..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <div className="relative">
          <Funnel size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-texto/30" />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="input-field pl-12 appearance-none bg-white min-w-[160px]"
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
            <option value="estoque_baixo">Estoque baixo</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(LIMIT)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : produtos.length === 0 ? (
        <EmptyState
          type="produtos"
          title="Nenhum produto encontrado"
          message="Comece adicionando seu primeiro perfume."
          linkTo="/produtos/novo"
          linkText="Adicionar produto"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map((produto) => (
              <div key={produto._id} className="card-sm hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden">
                  {produto.fotos?.[0] ? (
                    <img 
                      src={produto.fotos[0]} 
                      alt={produto.nome} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="img-placeholder h-full bg-gradient-to-br from-primaria/5 to-secundaria/10 flex flex-col items-center justify-center gap-2">
                      <span className="text-4xl">🌸</span>
                      <span className="text-xs text-texto/30 font-semibold">Sem foto</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${produto.ativo ? 'bg-sucesso/20 text-sucesso' : 'bg-gray-200 text-gray-500'}`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-texto line-clamp-1">{produto.nome}</h3>
                <p className="text-sm text-texto/50">{produto.marca}</p>
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-2xl font-bold text-primaria">
                    R$ {produto.preco ? produto.preco.toFixed(2) : '0.00'}
                  </span>
                  <span className={`text-sm font-medium flex items-center gap-1 ${produto.estoque <= 5 ? 'text-red-500' : 'text-texto/50'}`}>
                    {produto.estoque <= 5 && <Warning size={16} weight="bold" />}
                    {produto.estoque} un.
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleBaixaEstoque(produto)}
                    className="flex-1 flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-texto/70 py-2 rounded-xl text-sm transition"
                  >
                    <ArrowDown size={16} /> Baixa
                  </button>
                  <button
                    onClick={() => handleVerHistorico(produto)}
                    className="flex-1 flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-texto/70 py-2 rounded-xl text-sm transition"
                  >
                    Histórico
                  </button>
                </div>

                <div className="flex gap-2 mt-2 border-t border-gray-100 pt-3">
                  <Link
                    to={`/produtos/${produto._id}`}
                    className="flex-1 flex items-center justify-center gap-1 bg-primaria/10 hover:bg-primaria/20 text-primaria py-2 rounded-xl text-sm font-semibold transition"
                  >
                    <Pencil size={16} /> Editar
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(produto._id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    <Trash size={16} /> Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sentinel para scroll infinito */}
          {hasMore && <div ref={sentinelRef} className="h-4" />}
          
          {loadingMore && (
            <div className="mt-4 flex justify-center">
              <div className="w-8 h-8 rounded-full border-4 border-primaria/20 border-t-primaria animate-spin" />
            </div>
          )}
        </>
      )}

      {estoqueModal && (
        <StockModal
          produto={estoqueModal}
          onClose={() => setEstoqueModal(null)}
          onUpdate={() => carregarProdutos(1, true)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
      />
    </div>
  );
}
