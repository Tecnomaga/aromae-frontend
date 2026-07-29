import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Storefront, Sparkle, ShareNetwork, ArrowRight, Upload, CheckCircle } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { z } from 'zod';
import toast from 'react-hot-toast';

const slides = [
  { icon: Storefront, titulo: 'Sua vitrine de perfumes, do seu jeito', texto: 'Monte um catálogo lindo em minutos e mostre seus produtos com a cara do seu negócio.' },
  { icon: Sparkle, titulo: 'Gerencie seu império perfumado', texto: 'Controle estoque, pedidos e clientes em um só lugar, sempre pela palma da mão.' },
  { icon: ShareNetwork, titulo: 'Compartilhe sua essência', texto: 'Envie o link da sua loja pelo WhatsApp e Instagram e receba pedidos direto por lá.' }
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

const onboardingSchema = z.object({
  nomeLoja: z.string().min(3, 'Nome da loja deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'Link deve ter pelo menos 3 caracteres'),
  telefone: z.string().min(10, 'Telefone inválido (mínimo 10 dígitos)'),
  chavePix: z.string().optional()
});

export default function Onboarding() {
  const [passo, setPasso] = useState(0);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const { user, atualizarUsuario } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { nomeLoja: '', slug: '', telefone: '', chavePix: '' }
  });

  const nomeLoja = watch('nomeLoja');

  const handleNomeLoja = (e) => {
    const valor = e.target.value;
    setValue('nomeLoja', valor);
    setValue('slug', gerarSlug(valor));
  };

  const formatTelefone = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '($1) $2')
                 .replace(/(\d{5})(\d)/, '$1-$2')
                 .slice(0, 15);
    return value;
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoPerfil(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('nomeLoja', data.nomeLoja);
      formData.append('slug', data.slug);
      formData.append('telefone', data.telefone);
      if (data.chavePix) formData.append('chavePix', data.chavePix);
      if (fotoPerfil) formData.append('foto', fotoPerfil);

      const response = await api.put('/auth/loja', formData);

      if (atualizarUsuario) {
        atualizarUsuario(response.data);
      }

      toast.success('Vitrine criada com sucesso!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro ao salvar loja:', err);
      const mensagem = err.response?.data?.message || 'Erro ao criar a loja. Verifique sua conexão.';
      toast.error(mensagem);
    }
  };

  const totalSlides = slides.length;
  const naFormulario = passo === totalSlides;

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
              {slides.map((_, i) => <span key={i} className={`h-2 rounded-full transition-all ${i === passo ? 'w-6 bg-primaria' : 'w-2 bg-primaria/20'}`} />)}
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => setPasso(totalSlides)} className="text-sm text-texto/50 font-semibold">Pular</button>
              <button onClick={() => setPasso(passo + 1)} className="flex items-center gap-2 bg-primaria text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primaria/90 transition">
                {passo === totalSlides - 1 ? 'Criar minha loja' : 'Próximo'} <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in-up">
            <h1 className="font-titulo text-2xl text-primaria mb-1">Quase lá!</h1>
            <p className="text-texto/70 mb-6">Vamos dar identidade à sua vitrine.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primaria/10 flex items-center justify-center overflow-hidden mb-2">
                  {previewFoto ? <img src={previewFoto} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-2xl font-titulo text-primaria">{nomeLoja?.charAt(0) || 'A'}</span>}
                </div>
                <label className="inline-flex items-center gap-1 text-sm text-primaria font-semibold cursor-pointer">
                  <Upload size={16} /> Adicionar foto de perfil
                  <input type="file" accept="image/*" onChange={handleFoto} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Nome da sua loja *</label>
                <input type="text" {...register('nomeLoja')} onChange={handleNomeLoja} placeholder="Ex.: Flores Perfumadas" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
                {errors.nomeLoja && <p className="text-red-500 text-xs mt-1">{errors.nomeLoja.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Link personalizado *</label>
                <input type="text" {...register('slug')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                <p className="text-xs text-texto/50 mt-1">Sua vitrine: aromae.app/loja/{watch('slug') || 'sua-loja'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">WhatsApp (com DDD) *</label>
                <input type="tel" {...register('telefone')} onChange={(e) => { e.target.value = formatTelefone(e); }} placeholder="(11) 99999-9999" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
                {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
                <p className="text-xs text-texto/50 mt-1">Esse número será usado no botão "Pedir via WhatsApp" da sua vitrine.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Chave Pix para receber vendas (opcional)</label>
                <input type="text" {...register('chavePix')} placeholder="CPF, e-mail, telefone ou chave aleatória" className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
                <p className="text-xs text-texto/50 mt-1">Você poderá alterar depois no perfil. Recomendamos cadastrar para receber pagamentos via Pix.</p>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                <CheckCircle size={20} /> {isSubmitting ? 'Salvando...' : 'Concluir e entrar na loja'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
