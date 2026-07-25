import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, Users, Pencil, Trash, Phone, MapPin } from 'phosphor-react';
import api from '../services/api';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clientes')
      .then(({ data }) => setClientes(data))
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  }, []);

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.telefone.includes(busca)
  );

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;
    try {
      await api.delete(`/clientes/${id}`);
      setClientes(clientes.filter((c) => c._id !== id));
    } catch (err) {
      alert('Erro ao excluir cliente.');
    }
  };

  if (loading) return <p className="text-center py-10">Carregando clientes...</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="font-titulo text-3xl text-primaria">Clientes</h1>
        <Link
          to="/clientes/novo"
          className="flex items-center gap-2 bg-primaria text-white px-4 py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
        >
          <Plus size={20} /> Novo Cliente
        </Link>
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
        <div className="text-center py-10 bg-white rounded-xl shadow-sm">
          <Users size={48} className="mx-auto text-texto/20 mb-3" />
          <p className="text-texto/60">Nenhum cliente cadastrado.</p>
          <Link to="/clientes/novo" className="text-primaria font-semibold underline mt-2 inline-block">
            Cadastrar primeira cliente
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primaria/10 flex items-center justify-center text-primaria font-bold">
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
                  onClick={() => handleExcluir(cliente._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-500 py-1.5 rounded text-sm"
                >
                  <Trash size={16} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
