import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, Funnel, Package, Warning, Pencil, Trash, ArrowDown } from 'phosphor-react';
import api from '../services/api';
import StockModal from '../components/StockModal';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [estoqueModal, setEstoqueModal] = useState(null);

  const carregarProdutos = async () => {
    try {
      const { data } = await api.get('/produtos');
      setProdutos(data);
    } catch (err) {
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((p) => {
    if (filtro === 'ativos') return p.ativo;
    if (filtro === 'inativos') return !p.ativo;
    if (filtro === 'estoque_baixo') return p.estoque <= 5;
    return true;
  }).filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.marca.toLowerCase().includes(busca.toLowerCase())
  );

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/produtos/${id}`);
      setProdutos(produtos.filter((p) => p._id !== id));
    } catch (err) {
      alert('Erro ao excluir produto.');
    }
  };

  const handleBaixaEstoque = (produto) => setEstoqueModal({ ...produto, acao: 'baixa' });
  const handleVerHistorico = (produto) => setEstoqueModal({ ...produto, acao: 'historico' });

  if (loading) return <p className="text-center py-10">Carregando sua vitrine...</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="font-titulo text-3xl text-primaria">Seus Produtos</h1>
        <Link
          to="/produtos/novo"
          className="flex items-center gap-2 bg-primaria text-white px-4 py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
        >
          <Plus size={20} /> Novo Produto
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40" />
          <input
            type="text"
            placeholder="Buscar por nome ou marca..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>
        <div className="relative">
          <Funnel size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40" />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria appearance-none bg-white"
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
            <option value="estoque_baixo">Estoque baixo</option>
          </select>
        </div>
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
          <Package size={48} className="mx-auto text-texto/20 mb-3" />
          <p className="text-texto/60">Nenhum produto encontrado.</p>
          <Link to="/produtos/novo" className="text-primaria font-semibold underline mt-2 inline-block">
            Adicionar primeiro produto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtosFiltrados.map((produto) => (
            <div key={produto._id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col">
              <div className="h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {produto.fotos?.[0] ? (
                  <img src={produto.fotos[0]} alt={produto.nome} className="w-full h-full object-cover" />
                ) : (
                  <Package size={40} className="text-texto/20" />
                )}
              </div>
              <h3 className="font-bold text-lg">{produto.nome}</h3>
              <p className="text-sm text-texto/60">{produto.marca}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-lg font-bold text-primaria">R$ {produto.preco?.toFixed(2)}</span>
                <span className={`text-sm flex items-center gap-1 ${produto.estoque <= 5 ? 'text-red-500 font-bold' : 'text-texto/70'}`}>
                  {produto.estoque <= 5 && <Warning size={16} />}
                  {produto.estoque} un.
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleBaixaEstoque(produto)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-texto py-1.5 rounded text-sm"
                >
                  <ArrowDown size={16} /> Baixa
                </button>
                <button
                  onClick={() => handleVerHistorico(produto)}
                  className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-texto py-1.5 rounded text-sm"
                >
                  Histórico
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <Link
                  to={`/produtos/${produto._id}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-primaria/10 hover:bg-primaria/20 text-primaria py-1.5 rounded text-sm"
                >
                  <Pencil size={16} /> Editar
                </Link>
                <button
                  onClick={() => handleExcluir(produto._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 py-1.5 rounded text-sm"
                >
                  <Trash size={16} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {estoqueModal && (
        <StockModal
          produto={estoqueModal}
          onClose={() => setEstoqueModal(null)}
          onUpdate={carregarProdutos}
        />
      )}
    </div>
  );
}
