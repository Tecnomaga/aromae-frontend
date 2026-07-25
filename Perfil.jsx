import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Storefront, Link as LinkIcon, WhatsappLogo, InstagramLogo } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function Perfil() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setLoja(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleLoja = async () => {
    try {
      await api.patch('/auth/toggle-loja');
      setLoja({ ...loja, ativo: !loja.ativo });
    } catch (err) {
      alert('Erro ao alterar status da loja.');
    }
  };

  const compartilharLink = () => {
    const url = `${window.location.origin}/loja/${loja?.slug}`;
    if (navigator.share) {
      navigator.share({ title: loja?.nomeLoja, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado!');
    }
  };

  if (loading) return <p className="text-center py-10">Carregando perfil...</p>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-titulo text-3xl text-primaria mb-6">Meu Perfil</h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-primaria/10 flex items-center justify-center mb-4 overflow-hidden">
          {loja?.fotoPerfil ? (
            <img src={loja.fotoPerfil} alt="Foto" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-titulo text-primaria">{loja?.nomeLoja?.charAt(0) || 'A'}</span>
          )}
        </div>

        <h2 className="font-titulo text-2xl">{loja?.nomeLoja || 'Sua Loja'}</h2>
        <p className="text-texto/60 text-sm mt-1">{loja?.email}</p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className={`w-3 h-3 rounded-full ${loja?.ativo ? 'bg-sucesso' : 'bg-gray-400'}`}></span>
          <span className="text-sm font-semibold">{loja?.ativo ? 'Loja aberta' : 'Loja em pausa'}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('/perfil/editar')}
            className="w-full flex items-center justify-center gap-2 bg-primaria/10 text-primaria py-2 rounded-lg font-semibold"
          >
            <Pencil size={18} /> Editar perfil
          </button>
          <button
            onClick={handleToggleLoja}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold ${
              loja?.ativo ? 'bg-red-50 text-red-500' : 'bg-sucesso/20 text-sucesso'
            }`}
          >
            <Storefront size={18} /> {loja?.ativo ? 'Pausar loja' : 'Reabrir loja'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm font-semibold mb-3">Compartilhar sua vitrine</p>
          <div className="flex justify-center gap-4">
            <button onClick={compartilharLink} className="flex flex-col items-center text-texto/70 hover:text-primaria">
              <LinkIcon size={24} />
              <span className="text-xs">Copiar link</span>
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Veja minha loja de perfumes: ${window.location.origin}/loja/${loja?.slug}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex flex-col items-center text-texto/70 hover:text-primaria"
            >
              <WhatsappLogo size={24} />
              <span className="text-xs">WhatsApp</span>
            </a>
            <button onClick={compartilharLink} className="flex flex-col items-center text-texto/70 hover:text-primaria">
              <InstagramLogo size={24} />
              <span className="text-xs">Instagram</span>
            </button>
          </div>
        </div>

        <button onClick={logout} className="mt-6 text-sm text-red-500 font-semibold hover:underline">
          Sair da conta
        </button>
      </div>
    </div>
  );
}
