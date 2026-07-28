import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const registerPush = async () => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('🔕 Navegador não suporta notificações.');
        return;
      }

      const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        console.warn('🔕 VITE_VAPID_PUBLIC_KEY não definida.');
        return;
      }

      if (Notification.permission === 'denied') {
        console.warn('🔕 Usuário bloqueou notificações.');
        return;
      }

      try {
        // Aguarda o service worker do PWA ficar pronto
        const registration = await navigator.serviceWorker.ready;
        console.log('✅ Service Worker pronto!');

        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.warn('🔕 Permissão negada.');
            return;
          }
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        console.log('✅ Assinatura push gerada!');
        await api.post('/notifications/subscribe', { subscription });
        console.log('✅ Notificações ativadas!');

      } catch (error) {
        console.error('🔥 Erro ao ativar notificações:', error);
        toast.error('Erro ao ativar notificações. Verifique o console.');
      }
    };

    registerPush();
  }, [user]);

  return null;
}
