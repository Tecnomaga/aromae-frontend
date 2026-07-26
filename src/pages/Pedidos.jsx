import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, ClipboardText, Eye, FileCsv } from 'phosphor-react';
import api from '../services/api';

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

  useEffect(() => {
    api.get('/pedidos')
      .then(({ data }) => setPedidos(data))
      .catch(() => setPedidos([]))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <p className="text-center py-10">Carregando pedidos...</p>;

  // Data atual no formato YYYY-MM-DD para limitar o calendário
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
          max={today}  // <--- IMPEDE DIAS FUTUROS
          className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-primaria"
        />
      </div>

      {pedidosFiltrados.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
          <ClipboardText size={48} className="mx-auto text-texto/20 mb-3" />
          <p className="text-texto/60">Nenhum pedido encontrado.</p>
          <Link to="/pedidos/novo" className="text-primaria font-semibold underline mt-2 inline-block">
            Registrar primeiro pedido
          </Link>
        </div>
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
                <span className="font-bold text-primaria">R$ {pedido.total?.toFixed(2)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusMap[pedido.status]?.cor}`}>
                  {statusMap[pedido.status]?.label}
                </span>
                <Link to={`/pedidos/${pedido._id}`} className="text-primaria hover:underline flex items-center gap-1">
                  <Eye size={18} /> Ver
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
