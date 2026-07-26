import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Upload, Trash, CheckCircle } from 'phosphor-react';
import api from '../services/api';
import { produtoSchema } from '../schemas';
import toast from 'react-hot-toast';

const marcasSugeridas = ['Avon', 'Boticário', 'Natura', 'Jequiti', 'Mary Kay', 'Lancôme', 'Chanel', 'Dior', 'Importado', 'Outro'];
const etiquetasOpcoes = ['Lançamento', 'Mais vendido', 'Promoção', 'Edição limitada', 'Novidade'];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = !!id;

  const [fotos, setFotos] = useState([]);
  const [previewFotos, setPreviewFotos] = useState([]);
  const [etiquetasSelecionadas, setEtiquetasSelecionadas] = useState([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(produtoSchema),
    defaultValues: { nome: '', marca: '', preco: 0, estoque: 0, descricao: '', ativo: true }
  });

  useEffect(() => {
    if (editando) {
      api.get(`/produtos/${id}`)
        .then(({ data }) => {
          reset({
            nome: data.nome,
            marca: data.marca,
            preco: data.preco,
            estoque: data.estoque,
            descricao: data.descricao,
            ativo: data.ativo
          });
          setFotos(data.fotos || []);
          setPreviewFotos(data.fotos || []);
          setEtiquetasSelecionadas(data.etiquetas || []);
        })
        .catch(() => navigate('/produtos'));
    }
  }, [id, editando, navigate, reset]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const novosArquivos = [];

    for (const file of files) {
      if (fotos.length + novosArquivos.length >= 3) {
        toast.error('Máximo de 3 fotos permitidas.');
        break;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error('Formato de imagem inválido. Use JPEG, PNG ou WEBP.');
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error('A imagem deve ter no máximo 5MB.');
        continue;
      }
      novosArquivos.push(file);
    }

    const novasFotos = [...fotos, ...novosArquivos];
    const novasPreviews = [...previewFotos, ...novosArquivos.map(f => URL.createObjectURL(f))];
    setFotos(novasFotos);
    setPreviewFotos(novasPreviews);
  };

  const removerFoto = (index) => {
    const novasFotos = [...fotos];
    novasFotos.splice(index, 1);
    const novasPreviews = [...previewFotos];
    novasPreviews.splice(index, 1);
    setFotos(novasFotos);
    setPreviewFotos(novasPreviews);
  };

  const toggleEtiqueta = (etiqueta) => {
    if (etiquetasSelecionadas.includes(etiqueta)) {
      setEtiquetasSelecionadas(etiquetasSelecionadas.filter(e => e !== etiqueta));
    } else {
      setEtiquetasSelecionadas([...etiquetasSelecionadas, etiqueta]);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('nome', data.nome);
      formData.append('marca', data.marca);
      formData.append('preco', Number(data.preco));
      formData.append('estoque', Number(data.estoque));
      formData.append('descricao', data.descricao);
      formData.append('ativo', data.ativo);
      formData.append('etiquetas', JSON.stringify(etiquetasSelecionadas));

      fotos.forEach((foto) => {
        if (foto instanceof File) formData.append('fotos', foto);
        else formData.append('fotosExistentes', foto);
      });

      await toast.promise(
        editando ? api.put(`/produtos/${id}`, formData) : api.post('/produtos', formData),
        {
          loading: 'Salvando produto...',
          success: 'Produto salvo com sucesso!',
          error: 'Erro ao salvar produto.'
        }
      );
      navigate('/produtos');
    } catch (err) {
      toast.error('Erro ao salvar produto. Verifique os dados e sua conexão.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
        <ArrowLeft size={20} /> Voltar
      </button>
      <h1 className="font-titulo text-3xl text-primaria mb-6">
        {editando ? 'Editar Produto' : 'Novo Produto'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Nome do perfume *</label>
          <input
            type="text" {...register('nome')}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Marca *</label>
          <input
            type="text" {...register('marca')} list="marcas-lista"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          <datalist id="marcas-lista">
            {marcasSugeridas.map((m) => <option key={m} value={m} />)}
          </datalist>
          {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Preço (R$) *</label>
            <input
              type="number" {...register('preco', { valueAsNumber: true })} step="0.01" min="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
            {errors.preco && <p className="text-red-500 text-xs mt-1">{errors.preco.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Estoque (un.) *</label>
            <input
              type="number" {...register('estoque', { valueAsNumber: true })} min="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
            {errors.estoque && <p className="text-red-500 text-xs mt-1">{errors.estoque.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Descrição</label>
          <textarea
            {...register('descricao')} rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Fotos (até 3, PNG/JPG/WEBP, até 5MB)</label>
          <div className="flex gap-3 flex-wrap">
            {previewFotos.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => removerFoto(idx)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-red-500 hover:bg-white"
                >
                  <Trash size={14} />
                </button>
              </div>
            ))}
            {previewFotos.length < 3 && (
              <label className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primaria">
                <Upload size={24} className="text-texto/40" />
                <span className="text-xs text-texto/50 mt-1">Adicionar</span>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" multiple />
              </label>
            )}
          </div>
        </div>

        {/* Campo de Etiquetas */}
        <div>
          <label className="block text-sm font-semibold mb-2">Etiquetas (opcional)</label>
          <div className="flex flex-wrap gap-2">
            {etiquetasOpcoes.map((etiqueta) => (
              <button
                key={etiqueta}
                type="button"
                onClick={() => toggleEtiqueta(etiqueta)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  etiquetasSelecionadas.includes(etiqueta)
                    ? 'bg-primaria text-white'
                    : 'bg-gray-100 text-texto/60 hover:bg-gray-200'
                }`}
              >
                {etiqueta}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox" {...register('ativo')} id="ativo"
            className="w-4 h-4 text-primaria rounded"
          />
          <label htmlFor="ativo" className="text-sm font-semibold">Produto ativo na loja</label>
        </div>

        <button
          type="submit" disabled={isSubmitting}
          className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : editando ? 'Atualizar Produto' : 'Adicionar à Vitrine'}
        </button>
      </form>
    </div>
  );
}
