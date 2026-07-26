import { useState, useEffect } from 'react';
import { X, DownloadSimple } from 'phosphor-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Captura o evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Se o usuário já instalou, não mostra mais
  useEffect(() => {
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(false);
      }
    };
    checkInstalled();
    window.addEventListener('appinstalled', () => setShowPrompt(false));
    return () => window.removeEventListener('appinstalled', () => setShowPrompt(false));
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        if (result.outcome === 'accepted') {
          setShowPrompt(false);
        }
      } catch (error) {
        console.error('Erro ao instalar:', error);
      }
    }
  };

  const handleClose = () => setShowPrompt(false);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-4 flex items-center gap-4 max-w-md w-full border border-gray-100/50 animate-pop">
        <div className="flex-1">
          <p className="font-semibold text-sm text-texto">Instale o Aromaê</p>
          <p className="text-xs text-texto/50">Adicione à tela inicial para acessar rápido.</p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-primaria text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primaria/90 active:scale-95 transition-all flex items-center gap-2"
        >
          <DownloadSimple size={18} /> Instalar
        </button>
        <button
          onClick={handleClose}
          className="text-texto/40 hover:text-texto p-1"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
