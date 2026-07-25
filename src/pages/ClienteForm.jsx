import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'phosphor-react';
import api from '../services/api';
import { clienteSchema } from '../schemas';
import toast from 'react-hot-toast';

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = !!id;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues: { nome: '', telefone: '', cidade: '' }
  });

  useEffect(() => {
    if (editando) {
      api.get(`/clientes/${id}`)
        .then(({ data }) => reset({ nome: data.nome, telefone: data.telefone, cidade: data.cidade || '' }))
        .catch(() => navigate('/clientes'));
    }
  }, [id, editando, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      if (editando) {
        await api.put(`/clientes/${id}`, data);
      } else {
        await api.post('/clientes', data);
      }
      toast.success('Cliente salvo com sucesso!');
      navigate('/clientes');
    } catch (err) {
      toast.error('Erro ao salvar cliente. Verifique sua conexão com o servidor.');
    }
  };

  const formatTelefone = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '($1) $2')
                 .replace(/(\d{5})(\d)/, '$1-$2')
                 .slice(0, 15);
    return value;
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
        <ArrowLeft size={20} /> Voltar
      </button>
      <h1 className="font-titulo text-3xl text-primaria mb-6">
        {editando ? 'Editar Cliente' : 'Nova Cliente'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Nome *</label>
          <input
            type="text" {...register('nome')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Telefone (com DDD) *</label>
          <input
            type="tel"
            {...register('telefone')}
            onChange={(e) => { e.target.value = formatTelefone(e); }}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Cidade</label>
          <input
            type="text" {...register('cidade')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade.message}</p>}
        </div>

        <button
          type="submit" disabled={isSubmitting}
          className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : editando ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
        </button>
      </form>
    </div>
  );
}
