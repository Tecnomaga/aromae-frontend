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

    // Evita spam: registra apenas uma vez por sessão (ou após login)
    const jaRegistrado = localStorage.getItem('push_registrado');
    if (jaRegistrado === 'true') return;

    const registerPush = async () => {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        console.warn('Push desativado: navegador não suporta.');
        return;
      }

      const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        console.warn('Push desativado: chave VAPID não configurada no frontend.');
        return;
      }

      if (Notification.permission === 'denied') {
        console.warn('Push bloqueado pelo usuário.');
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;

        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            return;
          }
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        await api.post('/notifications/subscribe', { subscription });
        localStorage.setItem('push_registrado', 'true');
        toast.success('Notificações ativadas com sucesso!');
        console.log('✅ Notificações push ativadas.');
      } catch (error) {
        console.error('Erro ao ativar notificações:', error);
        // Não exibe toast para não irritar, mas loga o erro
      }
    };

    registerPush();
  }, [user]);

  return null;
}
