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
    console.error('Erro capturado:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/reset.html';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-fundo p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
            <h1 className="font-titulo text-2xl text-red-500 mb-4">Algo deu errado</h1>
            <p className="text-texto/70 mb-4">
              Ocorreu um erro inesperado. Clique no botão abaixo para limpar o cache e atualizar o sistema.
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
