import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-fundo p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md">
            <h1 className="font-titulo text-2xl text-red-500 mb-4">Algo deu errado</h1>
            <p className="text-texto/70 mb-6">Ocorreu um erro inesperado. Tente recarregar a página ou entre em contato com o suporte.</p>
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
