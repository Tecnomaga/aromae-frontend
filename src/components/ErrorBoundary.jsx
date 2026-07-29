import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '', isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    const isChunkError = error.message?.includes('Failed to fetch dynamically imported module') || 
                         error.message?.includes('Loading chunk') ||
                         error.message?.includes('ChunkLoadError') ||
                         error.message?.includes('NOT_FOUND');
    
    return { 
      hasError: true, 
      errorMessage: error.message || 'Erro desconhecido',
      isChunkError
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    if (this.state.isChunkError) {
      this.handleChunkError();
    }
  }

  handleChunkError = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => registration.unregister());
      }).finally(() => {
        if (window.caches) {
          window.caches.keys().then(names => {
            names.forEach(name => window.caches.delete(name));
          }).finally(() => {
            window.location.replace('/reset.html');
          });
        } else {
          window.location.replace('/reset.html');
        }
      });
    } else {
      window.location.replace('/reset.html');
    }
  };

  handleReload = () => {
    window.location.href = '/reset.html';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-fundo p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
            <h1 className="font-titulo text-2xl text-red-500 mb-4">
              {this.state.isChunkError ? 'Atualização necessária' : 'Algo deu errado'}
            </h1>
            <p className="text-texto/70 mb-4">
              {this.state.isChunkError 
                ? 'Uma nova versão do sistema está disponível. Clique abaixo para limpar o cache e atualizar.' 
                : 'Ocorreu um erro inesperado. Tente recarregar a página.'}
            </p>
            <button 
              onClick={this.handleReload} 
              className="bg-primaria text-white px-6 py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
            >
              Limpar Cache e Atualizar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
