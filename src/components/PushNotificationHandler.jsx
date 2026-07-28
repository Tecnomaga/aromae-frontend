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
        window.alert('Push desativado: navegador não suporta notificações.');
        return;
      }

      const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        window.alert('Push desativado: chave VAPID não configurada no frontend.');
        return;
      }

      if (Notification.permission === 'denied') {
        window.alert('Push bloqueado pelo usuário. Permita notificações no navegador.');
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        console.log('✅ Service Worker pronto!');

        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            window.alert('Permissão de notificação negada.');
            return;
          }
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        console.log('✅ Assinatura push gerada!');
        const response = await api.post('/notifications/subscribe', { subscription });
        console.log('✅ Notificações ativadas!');
        toast.success('Notificações ativadas com sucesso!');

      } catch (error) {
        console.error('🔥 Erro ao ativar notificações:', error);
        let mensagem = 'Erro desconhecido.';
        if (error.response) {
          mensagem = `Erro do servidor: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
        } else if (error.request) {
          mensagem = 'Sem resposta do servidor. Verifique sua conexão.';
        } else {
          mensagem = error.message;
        }
        window.alert('Erro ao ativar notificações: ' + mensagem);
        toast.error('Erro ao ativar notificações. Verifique o console.');
      }
    };

    registerPush();
  }, [user]);

  return null;
}
