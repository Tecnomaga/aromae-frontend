import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import InstallPrompt from './components/InstallPrompt';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Onboarding from './pages/Onboarding';
import Landing from './pages/Landing';
import Bloqueado from './pages/Bloqueado';
import Admin from './pages/Admin';
import Planos from './pages/Planos';
import CheckoutSuccess from './pages/CheckoutSuccess';
import Suporte from './pages/Suporte';
import Financeiro from './pages/Financeiro';
import Assinatura from './pages/Assinatura';
import GerenciarCupons from './pages/GerenciarCupons';
import GerenciarAvaliacoes from './pages/GerenciarAvaliacoes';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Produtos = lazy(() => import('./pages/Produtos'));
const ProdutoForm = lazy(() => import('./pages/ProdutoForm'));
const Pedidos = lazy(() => import('./pages/Pedidos'));
const PedidoForm = lazy(() => import('./pages/PedidoForm'));
const Clientes = lazy(() => import('./pages/Clientes'));
const ClienteForm = lazy(() => import('./pages/ClienteForm'));
const Perfil = lazy(() => import('./pages/Perfil'));
const PerfilEditar = lazy(() => import('./pages/PerfilEditar'));
const Configuracoes = lazy(() => import('./pages/Configuracoes'));
const CatalogoPublico = lazy(() => import('./pages/CatalogoPublico'));

function RotasProtegidas() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.ativo) return <Bloqueado />;
  return <Layout />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando módulo...</div>}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/loja/:slug" element={<CatalogoPublico />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/checkout/sucesso" element={<CheckoutSuccess />} />
              <Route path="/suporte" element={<Suporte />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/assinatura" element={<Assinatura />} />
              <Route path="/gerenciar-cupons" element={<GerenciarCupons />} />
              <Route path="/gerenciar-avaliacoes" element={<GerenciarAvaliacoes />} />

              <Route element={<RotasProtegidas />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/produtos/novo" element={<ProdutoForm />} />
                <Route path="/produtos/:id" element={<ProdutoForm />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/pedidos/novo" element={<PedidoForm />} />
                <Route path="/pedidos/:id" element={<PedidoForm />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/clientes/novo" element={<ClienteForm />} />
                <Route path="/clientes/:id" element={<ClienteForm />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/perfil/editar" element={<PerfilEditar />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <InstallPrompt />
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
