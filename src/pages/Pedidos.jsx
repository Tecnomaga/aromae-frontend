import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, ClipboardText, Eye, FileCsv, Trash } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';
import { ListSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const statusMap = {
  pendente: { label: 'Pendente', cor: 'bg-yellow-100 text-yellow-700' },
  pago: { label: 'Pago', cor: 'bg-green-100 text-green-700' },
  enviado: { label: 'Enviado', cor: 'bg-blue-100 text-blue-700' },
  entregue: { label: 'Entregue', cor: 'bg-sucesso/20 text-sucesso' },
  cancelado: { label: 'Cancelado', cor: 'bg-red-100 text-red-700' }
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroData, setFiltroData] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const { data } = await api.get('/pedidos');
      setPedidos(data);
    } catch {
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const pedidosFiltrados = pedidos
    .filter((p) => filtroStatus === 'todos' || p.status === filtroStatus)
    .filter((p) => {
      if (!filtroData) return true;
      return new Date(p.criadoEm).toISOString().slice(0, 10) === filtroData;
    })
    .filter((p) => {
      if (!busca) return true;
      const termo = busca.toLowerCase();
      return p.cliente?.nome?.toLowerCase().includes(termo) || p._id.includes(termo);
    });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/pedidos/${deleteTarget}`);
      toast.success('Pedido excluído!');
      carregarPedidos();
      setDeleteTarget(null);
    } catch {
      toast.error('Erro ao excluir pedido.');
    }
  };

  if (loading) return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-32" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-12 flex-1 rounded-xl" />
        <Skeleton className="h-12 w-40 rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
      <ListSkeleton rows={5} />
    </div>
  );

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="font-titulo text-3xl text-primaria">Pedidos</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => window.open('/api/relatorios/pedidos', '_blank')}
            className="flex items-center gap-2 bg-gray-100 text-texto px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            <FileCsv size={20} /> Exportar CSV
          </button>
          <Link
            to="/pedidos/novo"
            className="flex items-center gap-2 bg-primaria text-white px-4 py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
          >
            <Plus size={20} /> Novo Pedido
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40" />
          <input
            type="text" placeholder="Buscar por cliente ou ID..." value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>
        <select
          value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primaria"
        >
          <option value="todos">Todos os status</option>
          {Object.entries(statusMap).map(([value, { label }]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <input
          type="date"
          value={filtroData}
          onChange={(e) => setFiltroData(e.target.value)}
          max={today}
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primaria"
        />
      </div>

      {pedidosFiltrados.length === 0 ? (
        <EmptyState
          type="pedidos"
          title="Nenhum pedido encontrado"
          message="Registre seu primeiro pedido agora."
          linkTo="/pedidos/novo"
          linkText="Registrar pedido"
        />
      ) : (
        <div className="space-y-3">
          {pedidosFiltrados.map((pedido) => (
            <div key={pedido._id} className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-bold text-lg">{pedido.cliente?.nome || 'Cliente não informado'}</p>
                <p className="text-sm text-texto/60">{pedido.cliente?.telefone}</p>
                <p className="text-xs text-texto/40 mt-1">Pedido #{pedido._id.slice(-6)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-primaria">
                  R$ {pedido.total ? pedido.total.toFixed(2) : '0.00'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMap[pedido.status]?.cor}`}>
                  {statusMap[pedido.status]?.label}
                </span>
                <Link to={`/pedidos/${pedido._id}`} className="text-primaria hover:underline flex items-center gap-1">
                  <Eye size={18} /> Ver
                </Link>
                {(pedido.status === 'cancelado' || pedido.status === 'entregue') && (
                  <button
                    onClick={() => setDeleteTarget(pedido._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Pedido"
        message="Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita."
        confirmText="Excluir"
      />
    </div>
  );
}
