import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PushNotificationHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log('🔕 Usuário não logado, não ativando notificações.');
      return;
    }

    const registerPush = async () => {
      console.log('🔔 Tentando ativar notificações para:', user.email);

      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('🔕 Navegador não suporta notificações.');
        return;
      }

      // Verifica a chave pública no ambiente
      const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        console.warn('🔕 ERRO: VITE_VAPID_PUBLIC_KEY não está definida no Vercel!');
        toast.error('Notificações desativadas: chave pública não encontrada.');
        return;
      }
      console.log('✅ Chave pública encontrada!');

      if (Notification.permission === 'denied') {
        console.warn('🔕 Usuário bloqueou notificações.');
        return;
      }

      try {
        // Registra o Service Worker (garante que o sw.js esteja no ar)
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registrado!');

        if (Notification.permission === 'default') {
          console.log('🔔 Solicitando permissão...');
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.warn('🔕 Permissão negada.');
            return;
          }
        }

        // Converte a chave pública para o formato Uint8Array
        const applicationServerKey = urlBase64ToUint8Array(publicKey);
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        });

        console.log('✅ Assinatura push gerada!', subscription);
        await api.post('/notifications/subscribe', { subscription });
        console.log('✅ Notificações ativadas com sucesso!');

      } catch (error) {
        console.error('🔥 Erro ao ativar notificações:', error);
        toast.error('Erro ao ativar notificações. Verifique o console.');
      }
    };

    registerPush();
  }, [user]);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return null;
}
