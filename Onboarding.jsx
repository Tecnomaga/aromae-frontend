import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Storefront, Sparkle, ShareNetwork, ArrowRight, Upload, CheckCircle } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const slides = [
  {
    icon: Storefront,
    titulo: 'Sua vitrine de perfumes, do seu jeito',
    texto: 'Monte um catálogo lindo em minutos e mostre seus produtos com a cara do seu negócio.'
  },
  {
    icon: Sparkle,
    titulo: 'Gerencie seu império perfumado',
    texto: 'Controle estoque, pedidos e clientes em um só lugar, sempre pela palma da mão.'
  },
  {
    icon: ShareNetwork,
    titulo: 'Compartilhe sua essência',
    texto: 'Envie o link da sua loja pelo WhatsApp e Instagram e receba pedidos direto por lá.'
  }
];

function gerarSlug(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function Onboarding() {
  const [passo, setPasso] = useState(0); // 0,1,2 = slides, 3 = formulário
  const [nomeLoja, setNomeLoja] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEditadoManualmente, setSlugEditadoManualmente] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { atualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const totalSlides = slides.length;
  const naFormulario = passo === totalSlides;

  const handleNomeLoja = (valor) => {
    setNomeLoja(valor);
    if (!slugEditadoManualmente) setSlug(gerarSlug(valor));
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeLoja || !slug) {
      setErro('Preencha o nome da loja e o link personalizado.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      const formData = new FormData();
      formData.append('nomeLoja', nomeLoja);
      formData.append('slug', slug);
      if (fotoPerfil) formData.append('foto', fotoPerfil);
      const { data } = await api.put('/auth/loja', formData);
      atualizarUsuario(data);
      navigate('/');
    } catch (err) {
      setErro('Não foi possível salvar agora. Confira sua conexão com o servidor e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        {!naFormulario ? (
          <>
            {(() => {
              const Slide = slides[passo];
              const Icon = Slide.icon;
              return (
                <div key={passo} className="text-center animate-fade-in-up">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primaria/10 flex items-center justify-center mb-6">
                    <Icon size={44} weight="duotone" className="text-primaria" />
                  </div>
                  <h1 className="font-titulo text-2xl text-texto mb-3">{Slide.titulo}</h1>
                  <p className="text-texto/70">{Slide.texto}</p>
                </div>
              );
            })()}

            <div className="flex justify-center gap-2 my-8">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${i === passo ? 'w-6 bg-primaria' : 'w-2 bg-primaria/20'}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setPasso(totalSlides)}
                className="text-sm text-texto/50 font-semibold"
              >
                Pular
              </button>
              <button
                onClick={() => setPasso(passo + 1)}
                className="flex items-center gap-2 bg-primaria text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primaria/90 transition"
              >
                {passo === totalSlides - 1 ? 'Criar minha loja' : 'Próximo'} <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in-up">
            <h1 className="font-titulo text-2xl text-primaria mb-1">Quase lá!</h1>
            <p className="text-texto/70 mb-6">Vamos dar identidade à sua vitrine.</p>

            {erro && <p className="text-red-500 text-sm mb-4">{erro}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primaria/10 flex items-center justify-center overflow-hidden mb-2">
                  {previewFoto ? (
                    <img src={previewFoto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-titulo text-primaria">{nomeLoja?.charAt(0) || 'A'}</span>
                  )}
                </div>
                <label className="inline-flex items-center gap-1 text-sm text-primaria font-semibold cursor-pointer">
                  <Upload size={16} /> Adicionar foto de perfil
                  <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nome da sua loja *</label>
                <input
                  type="text"
                  value={nomeLoja}
                  onChange={(e) => handleNomeLoja(e.target.value)}
                  placeholder="Ex.: Flores Perfumadas"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Link personalizado *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugEditadoManualmente(true);
                    setSlug(gerarSlug(e.target.value));
                  }}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
                />
                <p className="text-xs text-texto/50 mt-1">Sua vitrine: aromae.app/loja/{slug || 'sua-loja'}</p>
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} /> {carregando ? 'Salvando...' : 'Concluir e entrar na loja'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
