import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, Users, Pencil, Trash, Phone, MapPin, FileCsv } from 'phosphor-react';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import { ListSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    api.get('/clientes')
      .then(({ data }) => setClientes(data))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  }, []);

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/clientes/${deleteTarget}`);
    setClientes(clientes.filter((c) => c._id !== deleteTarget));
    setDeleteTarget(null);
  };

  if (loading) return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div className="h-10 w-32 bg-gray-200 rounded animate-shimmer" />
        <div className="flex gap-3">
          <div className="h-10 w-36 bg-gray-200 rounded-lg animate-shimmer" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-shimmer" />
        </div>
      </div>
      <div className="h-12 w-full bg-gray-200 rounded-xl animate-shimmer mb-6" />
      <ListSkeleton rows={6} />
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="font-titulo text-3xl text-primaria">Clientes</h1>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => window.open('/api/relatorios/clientes', '_blank')}
            className="flex items-center gap-2 bg-gray-100 text-texto px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            <FileCsv size={20} /> Exportar CSV
          </button>
          <Link
            to="/clientes/novo"
            className="flex items-center gap-2 bg-primaria text-white px-4 py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
          >
            <Plus size={20} /> Novo Cliente
          </Link>
        </div>
      </div>

      <div className="relative mb-6">
        <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-texto/40" />
        <input
          type="text" placeholder="Buscar por nome ou telefone..." value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
        />
      </div>

      {clientesFiltrados.length === 0 ? (
        <EmptyState
          type="clientes"
          title="Nenhuma cliente cadastrada"
          message="Cadastre sua primeira cliente agora."
          linkTo="/clientes/novo"
          linkText="Cadastrar cliente"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primaria/20 to-secundaria/20 flex items-center justify-center text-primaria font-bold">
                  {cliente.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{cliente.nome}</p>
                  <p className="text-xs text-texto/50 flex items-center gap-1">
                    <Phone size={12} /> {cliente.telefone}
                  </p>
                  {cliente.cidade && (
                    <p className="text-xs text-texto/50 flex items-center gap-1">
                      <MapPin size={12} /> {cliente.cidade}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/clientes/${cliente._id}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-primaria/10 hover:bg-primaria/20 text-primaria py-1.5 rounded text-sm"
                >
                  <Pencil size={16} /> Editar
                </Link>
                <button
                  onClick={() => setDeleteTarget(cliente._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 py-1.5 rounded text-sm"
                >
                  <Trash size={16} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        confirmText="Excluir"
      />
    </div>
  );
}
