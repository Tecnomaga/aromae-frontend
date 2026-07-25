import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import ProdutoForm from './pages/ProdutoForm';
import Pedidos from './pages/Pedidos';
import PedidoForm from './pages/PedidoForm';
import Clientes from './pages/Clientes';
import ClienteForm from './pages/ClienteForm';
import Perfil from './pages/Perfil';
import PerfilEditar from './pages/PerfilEditar';
import Configuracoes from './pages/Configuracoes';
import CatalogoPublico from './pages/CatalogoPublico';

function RotasProtegidas() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Layout />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/loja/:slug" element={<CatalogoPublico />} />

          <Route element={<RotasProtegidas />}>
            <Route path="/" element={<Dashboard />} />
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
      </BrowserRouter>
    </AuthProvider>
  );
}
