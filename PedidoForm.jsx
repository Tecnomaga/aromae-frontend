import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash, Plus } from 'phosphor-react';
import api from '../services/api';

const statusOpcoes = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

export default function PedidoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = !!id;

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteBusca, setClienteBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [itens, setItens] = useState([]);
  const [status, setStatus] = useState('pendente');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/clientes').then(({ data }) => setClientes(data)).catch(() => setClientes([]));
    api.get('/produtos?ativos=true').then(({ data }) => setProdutos(data)).catch(() => setProdutos([]));

    if (editando) {
      api.get(`/pedidos/${id}`).then(({ data }) => {
        setClienteSelecionado(data.cliente);
        setClienteBusca(data.cliente?.nome || '');
        setItens(data.itens.map((item) => ({
          produto: item.produto, quantidade: item.quantidade, precoUnitario: item.precoUnitario
        })));
        setStatus(data.status);
      }).catch(() => navigate('/pedidos'));
    }
  }, [id, editando, navigate]);

  const clientesFiltrados = clienteBusca.length > 0
    ? clientes.filter((c) => c.nome.toLowerCase().includes(clienteBusca.toLowerCase()))
    : [];

  const adicionarItem = () => setItens([...itens, { produto: null, quantidade: 1, precoUnitario: 0 }]);

  const removerItem = (index) => {
    const novos = [...itens];
    novos.splice(index, 1);
    setItens(novos);
  };

  const atualizarItem = (index, campo, valor) => {
    const novos = [...itens];
    novos[index][campo] = valor;
    if (campo === 'produto') {
      const prod = produtos.find((p) => p._id === valor);
      if (prod) novos[index].precoUnitario = prod.preco;
    }
    setItens(novos);
  };

  const calcularTotal = () => itens.reduce((total, item) => total + (item.precoUnitario * item.quantidade || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clienteSelecionado) {
      setErro('Selecione um cliente.');
      return;
    }
    if (itens.length === 0) {
      setErro('Adicione ao menos um produto.');
      return;
    }
    if (itens.some((i) => !i.produto)) {
      setErro('Selecione um produto para cada item.');
      return;
    }

    const dados = {
      cliente: clienteSelecionado._id,
      itens: itens.map(({ produto, quantidade, precoUnitario }) => ({ produto, quantidade, precoUnitario })),
      status,
      total: calcularTotal()
    };

    setLoading(true);
    setErro('');
    try {
      if (editando) {
        await api.put(`/pedidos/${id}`, dados);
      } else {
        await api.post('/pedidos', dados);
      }
      navigate('/pedidos');
    } catch (err) {
      setErro('Erro ao salvar pedido. Verifique sua conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
        <ArrowLeft size={20} /> Voltar
      </button>
      <h1 className="font-titulo text-3xl text-primaria mb-6">
        {editando ? 'Editar Pedido' : 'Novo Pedido'}
      </h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Cliente *</label>
          <input
            type="text" placeholder="Buscar cliente pelo nome..." value={clienteBusca}
            onChange={(e) => { setClienteBusca(e.target.value); setClienteSelecionado(null); }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          {clienteBusca && !clienteSelecionado && clientesFiltrados.length > 0 && (
            <ul className="mt-1 border border-gray-200 rounded-lg bg-white max-h-40 overflow-y-auto">
              {clientesFiltrados.map((c) => (
                <li
                  key={c._id}
                  onClick={() => { setClienteSelecionado(c); setClienteBusca(c.nome); }}
                  className="px-4 py-2 hover:bg-primaria/5 cursor-pointer text-sm"
                >
                  {c.nome} – {c.telefone}
                </li>
              ))}
            </ul>
          )}
          {clienteSelecionado && (
            <p className="mt-1 text-sm text-sucesso font-semibold">
              Cliente selecionado: {clienteSelecionado.nome} ({clienteSelecionado.telefone})
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold">Produtos</label>
            <button type="button" onClick={adicionarItem} className="text-primaria flex items-center gap-1 text-sm font-semibold">
              <Plus size={16} /> Adicionar item
            </button>
          </div>
          {itens.map((item, index) => (
            <div key={index} className="flex flex-wrap items-end gap-2 mb-3 p-3 border border-gray-100 rounded-lg">
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs">Produto</label>
                <select
                  value={item.produto || ''} onChange={(e) => atualizarItem(index, 'produto', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Selecione...</option>
                  {produtos.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nome} – R$ {p.preco?.toFixed(2)} (Estoque: {p.estoque})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="text-xs">Qtd</label>
                <input
                  type="number" min="1" value={item.quantidade}
                  onChange={(e) => atualizarItem(index, 'quantidade', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="w-28">
                <label className="text-xs">Preço Unit.</label>
                <input
                  type="number" step="0.01" value={item.precoUnitario}
                  onChange={(e) => atualizarItem(index, 'precoUnitario', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <button type="button" onClick={() => removerItem(index)} className="text-red-500 p-1">
                <Trash size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
              {statusOpcoes.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex items-end">
            <div className="bg-fundo px-4 py-2 rounded-lg w-full text-right">
              <span className="text-sm text-texto/60">Total</span>
              <p className="text-xl font-bold text-primaria">R$ {calcularTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : editando ? 'Atualizar Pedido' : 'Registrar Pedido'}
        </button>
      </form>
    </div>
  );
}
