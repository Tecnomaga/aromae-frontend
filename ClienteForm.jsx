import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import api from '../services/api';

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = !!id;

  const [form, setForm] = useState({ nome: '', telefone: '', cidade: '' });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (editando) {
      api.get(`/clientes/${id}`)
        .then(({ data }) => setForm({ nome: data.nome, telefone: data.telefone, cidade: data.cidade || '' }))
        .catch(() => navigate('/clientes'));
    }
  }, [id, editando, navigate]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'telefone') {
      value = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.telefone) {
      setErro('Nome e telefone são obrigatórios.');
      return;
    }
    setLoading(true);
    setErro('');
    try {
      if (editando) {
        await api.put(`/clientes/${id}`, form);
      } else {
        await api.post('/clientes', form);
      }
      navigate('/clientes');
    } catch (err) {
      setErro('Erro ao salvar cliente. Verifique sua conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
        <ArrowLeft size={20} /> Voltar
      </button>
      <h1 className="font-titulo text-3xl text-primaria mb-6">
        {editando ? 'Editar Cliente' : 'Nova Cliente'}
      </h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nome *</label>
          <input
            type="text" name="nome" value={form.nome} onChange={handleChange} required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Telefone (com DDD) *</label>
          <input
            type="tel" name="telefone" value={form.telefone} onChange={handleChange}
            placeholder="(11) 99999-9999" required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Cidade</label>
          <input
            type="text" name="cidade" value={form.cidade} onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : editando ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </button>
      </form>
    </div>
  );
}
