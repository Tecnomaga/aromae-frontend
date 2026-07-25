import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'phosphor-react';
import api from '../services/api';

export default function PerfilEditar() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: '', nomeLoja: '', slug: '', fotoPerfil: null });
  const [previewFoto, setPreviewFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => {
        setForm({ nome: data.nome, nomeLoja: data.nomeLoja, slug: data.slug, fotoPerfil: data.fotoPerfil });
        setPreviewFoto(data.fotoPerfil || null);
      })
      .catch(() => navigate('/perfil'));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, fotoPerfil: file });
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const formData = new FormData();
      formData.append('nome', form.nome);
      formData.append('nomeLoja', form.nomeLoja);
      formData.append('slug', form.slug);
      if (form.fotoPerfil instanceof File) formData.append('foto', form.fotoPerfil);
      await api.put('/auth/perfil', formData);
      navigate('/perfil');
    } catch (err) {
      setErro('Erro ao atualizar perfil. Verifique sua conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-texto/60 hover:text-texto mb-4">
        <ArrowLeft size={20} /> Voltar
      </button>
      <h1 className="font-titulo text-3xl text-primaria mb-6">Editar Perfil</h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-primaria/10 flex items-center justify-center overflow-hidden mb-2">
            {previewFoto ? (
              <img src={previewFoto} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-titulo text-primaria">{form.nomeLoja?.charAt(0) || 'A'}</span>
            )}
          </div>
          <label className="inline-flex items-center gap-1 text-sm text-primaria font-semibold cursor-pointer">
            <Upload size={16} /> Alterar foto
            <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Seu nome</label>
          <input
            type="text" name="nome" value={form.nome} onChange={handleChange} required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Nome da loja</label>
          <input
            type="text" name="nomeLoja" value={form.nomeLoja} onChange={handleChange} required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Slug da loja</label>
          <input
            type="text" name="slug" value={form.slug} onChange={handleChange} required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
          />
          <p className="text-xs text-texto/50 mt-1">Link: aromae.app/loja/{form.slug}</p>
        </div>

        <button
          type="submit" disabled={loading}
          className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </div>
  );
}
