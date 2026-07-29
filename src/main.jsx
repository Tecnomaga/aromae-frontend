import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

// NOVA LINHA ABAIXO - Força a limpeza de cache e recarga se detectar erro de carregamento
window.addEventListener('error', function(e) {
  if (e.message && (e.message.includes('Failed to fetch dynamically imported module') || e.message.includes('NOT_FOUND'))) {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', '1');
      window.location.reload();
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        success: { className: 'toast-success', duration: 4000, icon: '✅' },
        error: { className: 'toast-error', duration: 4000, icon: '❌' },
        loading: { className: 'toast-info', duration: 2000, icon: '⏳' },
        blank: { className: 'toast-info', duration: 3000, icon: 'ℹ️' },
      }}
    />
  </React.StrictMode>
);
