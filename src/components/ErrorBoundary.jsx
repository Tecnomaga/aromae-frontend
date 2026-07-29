import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro na aplicação:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-fundo p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md text-center">
            <h1 className="font-titulo text-2xl text-red-500 mb-4">Algo deu errado</h1>
            <p className="text-texto/70 mb-6">Ocorreu um erro inesperado. Tente recarregar a página.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primaria text-white px-6 py-3 rounded-xl font-semibold hover:bg-primaria/90 transition"
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
