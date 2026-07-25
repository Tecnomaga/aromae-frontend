import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, Trash, CheckCircle } from 'phosphor-react';
import api from '../services/api';

const marcasSugeridas = ['Avon', 'Boticário', 'Natura', 'Jequiti', 'Mary Kay', 'Lancôme', 'Chanel', 'Dior', 'Importado', 'Outro'];

export default function ProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', marca: '', preco: '', estoque: '', descricao: '', fotos: [], ativo: true
  });
  const [previewFotos, setPreviewFotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const editando = !!id;

  useEffect(() => {
    if (editando) {
      api.get(`/produtos/${id}`)
        .then(({ data }) => {
          setForm({
            nome: data.nome, marca: data.marca, preco: data.preco, estoque: data.estoque,
            descricao: data.descricao, fotos: data.fotos || [], ativo: data.ativo
          });
          setPreviewFotos(data.fotos || []);
        })
        .catch(() => navigate('/produtos'));
    }
  }, [id, editando, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - previewFotos.length);
    const novasFotos = [...form.fotos];
    const novasPreviews = [...previewFotos];

    files.forEach((file) => {
      novasPreviews.push(URL.createObjectURL(file));
      novasFotos.push(file);
    });

    setPreviewFotos(novasPreviews.slice(0, 3));
    setForm({ ...form, fotos: novasFotos.slice(0, 3) });
  };

  const removerFoto = (index) => {
    const novasFotos = [...form.fotos];
    novasFotos.splice(index, 1);
    const novasPreviews = [...previewFotos];
    novasPreviews.splice(index, 1);
    setForm({ ...form, fotos: novasFotos });
    setPreviewFotos(novasPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.nome || !form.marca || !form.preco || !form.estoque) {
      setErro('Preencha nome, marca, preço e estoque.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nome', form.nome);
      formData.append('marca', form.marca);
      formData.append('preco', Number(form.preco));
      formData.append('estoque', Number(form.estoque));
      formData.append('descricao', form.descricao);
      formData.append('ativo', form.ativo);
      form.fotos.forEach((foto) => {
        if (foto instanceof File) formData.append('fotos', foto);
        else formData.append('fotosExistentes', foto);
      });

      if (editando) {
        await api.put(`/produtos/${id}`, formData);
      } else {
        await api.post('/produtos', formData);
      }
      setSucesso(true);
      setTimeout(() => navigate('/produtos'), 900);
    } catch (err) {
      setErro('Erro ao salvar produto. Verifique os dados e sua conexão com o servidor.');
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
        {editando ? 'Editar Produto' : 'Novo Produto'}
      </h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}
      {sucesso && (
        <p className="text-sucesso font-semibold mb-4 flex items-center gap-2 animate-pop">
          <CheckCircle size={20} weight="fill" /> Produto adicionado à sua vitrine!
        </p>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Nome do perfume *</label>
          <input
            type="text" name="nome" value={form.nome} onChange={handleChange} required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Marca *</label>
          <input
            type="text" name="marca" value={form.marca} onChange={handleChange} list="marcas-lista" required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          <datalist id="marcas-lista">
            {marcasSugeridas.map((m) => <option key={m} value={m} />)}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Preço (R$) *</label>
            <input
              type="number" name="preco" value={form.preco} onChange={handleChange} step="0.01" min="0" required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Estoque (un.) *</label>
            <input
              type="number" name="estoque" value={form.estoque} onChange={handleChange} min="0" required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Descrição</label>
          <textarea
            name="descricao" value={form.descricao} onChange={handleChange} rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Fotos (até 3)</label>
          <div className="flex gap-3 flex-wrap">
            {previewFotos.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img src={src} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => removerFoto(idx)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-red-500"
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox" name="ativo" checked={form.ativo} onChange={handleChange} id="ativo"
            className="w-4 h-4 text-primaria rounded"
          />
          <label htmlFor="ativo" className="text-sm font-semibold">Produto ativo na loja</label>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : editando ? 'Atualizar Produto' : 'Adicionar à Vitrine'}
        </button>
      </form>
    </div>
  );
}
