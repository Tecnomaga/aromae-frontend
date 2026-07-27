import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function PushNotificationHandler() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const registerPush = async () => {
      // 1. Verifica se o navegador suporta e se o usuário já permitiu
      if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

      if (Notification.permission === 'denied') return;

      // 2. Registra o Service Worker
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        // 3. Pede permissão se ainda não foi concedida
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') return;
        }

        // 4. Pega a assinatura e envia para o backend
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
        });

        await api.post('/notifications/subscribe', { subscription });
        console.log('✅ Notificações Push ativadas!');

      } catch (error) {
        console.error('Erro ao ativar notificações:', error);
      }
    };

    registerPush();

  }, [user]);

  // Função auxiliar para converter a chave pública
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
