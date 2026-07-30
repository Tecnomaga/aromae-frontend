import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trash, Plus } from 'phosphor-react';
import api from '../services/api';
import { pedidoSchema } from '../schemas';
import toast from 'react-hot-toast';

const statusOpcoes = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

export default function PedidoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = !!id;

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteBusca, setClienteBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);

  const { register, handleSubmit, control, watch, setValue, getValues, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(pedidoSchema),
    defaultValues: { cliente: '', itens: [], status: 'pendente' }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'itens' });
  const itens = watch('itens');

  useEffect(() => {
    api.get('/clientes').then(({ data }) => setClientes(data)).catch(() => setClientes([]));
    api.get('/produtos?ativos=true').then(({ data }) => setProdutos(data)).catch(() => setProdutos([]));

    if (editando) {
      api.get(`/pedidos/${id}`).then(({ data }) => {
        setClienteSelecionado(data.cliente);
        setClienteBusca(data.cliente?.nome || '');
        setValue('cliente', data.cliente?._id || '');
        reset({
          cliente: data.cliente?._id || '',
          itens: data.itens.map((item) => ({
            produto: item.produto._id || item.produto,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario
          })),
          status: data.status
        });
      }).catch(() => navigate('/pedidos'));
    }
  }, [id, editando, navigate, setValue, reset]);

  const clientesFiltrados = clienteBusca.length > 0
    ? clientes.filter((c) => c.nome.toLowerCase().includes(clienteBusca.toLowerCase()))
    : [];

  const adicionarItem = () => append({ produto: '', quantidade: 1, precoUnitario: 0 });

  const atualizarPrecoUnitario = (index, produtoId) => {
    const prod = produtos.find((p) => p._id === produtoId);
    if (prod) {
      const preco = prod.preco || 0;
      setValue(`itens.${index}.precoUnitario`, preco);
    }
  };

  const calcularTotal = () => {
    const currentItens = getValues('itens') || [];
    return currentItens.reduce((total, item) => total + (item.precoUnitario * item.quantidade || 0), 0);
  };

  const onSubmit = async (data) => {
    const dados = {
      cliente: clienteSelecionado?._id,
      itens: data.itens,
      status: data.status,
      total: calcularTotal()
    };

    try {
      if (editando) {
        await api.put(`/pedidos/${id}`, dados);
      } else {
        await api.post('/pedidos', dados);
      }
      toast.success('Pedido salvo com sucesso!');
      navigate('/pedidos');
    } catch (err) {
      toast.error('Erro ao salvar pedido. Verifique sua conexão.');
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

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
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
                  onClick={() => { setClienteSelecionado(c); setClienteBusca(c.nome); setValue('cliente', c._id); }}
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
          {errors.cliente && <p className="text-red-500 text-xs mt-1">{errors.cliente.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold">Produtos</label>
            <button type="button" onClick={adicionarItem} className="text-primaria flex items-center gap-1 text-sm font-semibold">
              <Plus size={16} /> Adicionar item
            </button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-wrap items-end gap-2 mb-3 p-3 border border-gray-100 rounded-lg">
              <div className="flex-1 min-w-[140px]">
                <label className="text-xs">Produto</label>
                <select
                  {...register(`itens.${index}.produto`)}
                  onChange={(e) => atualizarPrecoUnitario(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">Selecione...</option>
                  {produtos.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.nome} – R$ {p.preco?.toFixed(2)} (Estoque: {p.estoque})
                    </option>
                  ))}
                </select>
                {errors.itens?.[index]?.produto && <p className="text-red-500 text-xs">{errors.itens[index].produto.message}</p>}
              </div>
              <div className="w-20">
                <label className="text-xs">Qtd</label>
                <input
                  type="number" min="1" {...register(`itens.${index}.quantidade`, { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="w-28">
                <label className="text-xs">Preço Unit.</label>
                <input
                  type="number" step="0.01" {...register(`itens.${index}.precoUnitario`, { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <button type="button" onClick={() => remove(index)} className="text-red-500 p-1">
                <Trash size={20} />
              </button>
            </div>
          ))}
          {errors.itens && <p className="text-red-500 text-xs">{errors.itens.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select {...register('status')} className="w-full px-4 py-2 border border-gray-200 rounded-lg">
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
          type="submit" disabled={isSubmitting}
          className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : editando ? 'Atualizar Pedido' : 'Registrar Pedido'}
        </button>
      </form>
    </div>
  );
}
