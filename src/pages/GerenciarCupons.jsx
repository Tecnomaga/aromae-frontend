import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash, Check, X } from 'phosphor-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function GerenciarCupons() {
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoCupom, setNovoCupom] = useState({
    codigo: '',
    desconto: 0,
    tipo: 'percentual',
    expiraEm: '',
    maxUsos: 1
  });

  useEffect(() => {
    carregarCupons();
  }, []);

  const carregarCupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cupons');
      setCupons(data);
    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
      toast.error(error.response?.data?.message || 'Erro ao carregar cupons');
    } finally {
      setLoading(false);
    }
  };

  const criarCupom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/cupons', novoCupom);
      toast.success('Cupom criado!');
      setNovoCupom({ codigo: '', desconto: 0, tipo: 'percentual', expiraEm: '', maxUsos: 1 });
      carregarCupons();
    } catch (error) {
      console.error('Erro ao criar cupom:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar cupom');
    }
  };

  const deletarCupom = async (id) => {
    if (!confirm('Remover este cupom?')) return;
    try {
      await api.delete(`/cupons/${id}`);
      toast.success('Cupom removido');
      carregarCupons();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao remover cupom');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando cupons...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <h1 className="font-titulo text-3xl text-primaria mb-6">Gerenciar Cupons</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Novo Cupom</h2>
        <form onSubmit={criarCupom} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Código"
            value={novoCupom.codigo}
            onChange={(e) => setNovoCupom({ ...novoCupom, codigo: e.target.value.toUpperCase() })}
            className="input-field"
            required
          />
          <input
            type="number"
            placeholder="Desconto"
            value={novoCupom.desconto}
            onChange={(e) => setNovoCupom({ ...novoCupom, desconto: Number(e.target.value) })}
            className="input-field"
            required
            min="1"
          />
          <select
            value={novoCupom.tipo}
            onChange={(e) => setNovoCupom({ ...novoCupom, tipo: e.target.value })}
            className="input-field"
          >
            <option value="percentual">Percentual</option>
            <option value="fixo">Fixo</option>
          </select>
          <input
            type="date"
            value={novoCupom.expiraEm}
            onChange={(e) => setNovoCupom({ ...novoCupom, expiraEm: e.target.value })}
            className="input-field"
            required
          />
          <input
            type="number"
            placeholder="Máx. usos"
            value={novoCupom.maxUsos}
            onChange={(e) => setNovoCupom({ ...novoCupom, maxUsos: Number(e.target.value) })}
            className="input-field"
            min="1"
          />
          <button
            type="submit"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Criar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-texto/70">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Desconto</th>
              <th className="px-4 py-3">Expira</th>
              <th className="px-4 py-3">Usos</th>
              <th className="px-4 py-3">Ativo</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cupons.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-bold">{c.codigo}</td>
                <td className="px-4 py-3">
                  {c.tipo === 'percentual' ? `${c.desconto}%` : `R$ ${c.desconto.toFixed(2)}`}
                </td>
                <td className="px-4 py-3">
                  {new Date(c.expiraEm).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3">{c.usos}/{c.maxUsos}</td>
                <td className="px-4 py-3">
                  <span className={c.ativo ? 'text-sucesso' : 'text-red-500'}>
                    {c.ativo ? <Check size={20} weight="bold" /> : <X size={20} weight="bold" />}
                  </span>
                </td>
                <td className="px-4 py-3 text-right flex justify-end gap-2">
                  <button className="text-primaria hover:text-primaria/80">
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => deletarCupom(c._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
