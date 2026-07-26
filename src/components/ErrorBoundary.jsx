import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '', isChunkError: false };
  }

  static getDerivedStateFromError(error) {
    // Verifica se o erro é de importação dinâmica (chunk load failed)
    const isChunkError = error.message?.includes('Failed to fetch dynamically imported module') || 
                         error.message?.includes('Loading chunk') ||
                         error.message?.includes('ChunkLoadError');
    
    return { 
      hasError: true, 
      errorMessage: error.message || 'Erro desconhecido',
      isChunkError
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    // Se for erro de chunk, força recarga sem cache
    if (this.state.isChunkError) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-fundo p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
            <h1 className="font-titulo text-2xl text-red-500 mb-4">
              {this.state.isChunkError ? 'Módulo não carregado' : 'Algo deu errado'}
            </h1>
            <p className="text-texto/70 mb-4">
              {this.state.isChunkError 
                ? 'Ocorreu um erro ao carregar uma parte do aplicativo. Isso geralmente é um problema de cache ou rede.' 
                : 'Ocorreu um erro inesperado.'}
            </p>
            <button 
              onClick={this.handleReload} 
              className="bg-primaria text-white px-6 py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
