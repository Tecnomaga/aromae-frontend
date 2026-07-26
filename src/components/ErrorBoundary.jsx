import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message || 'Erro desconhecido' };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
    // Se quiser, pode enviar para um serviço de logs (ex: Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-fundo p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
            <h1 className="font-titulo text-2xl text-red-500 mb-4">Algo deu errado</h1>
            <p className="text-texto/70 mb-4">Ocorreu um erro inesperado.</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-left mb-6">
              <p className="text-red-700 text-sm font-mono break-all">
                <strong>Erro:</strong> {this.state.errorMessage}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primaria text-white px-6 py-2 rounded-lg font-semibold hover:bg-primaria/90 transition"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
