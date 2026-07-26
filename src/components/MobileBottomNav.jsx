import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { House, Package, ClipboardText, Users, User, Gear } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';

const mainLinks = [
  { to: '/dashboard', icon: House, label: 'Início' },
  { to: '/produtos', icon: Package, label: 'Produtos' },
  { to: '/pedidos', icon: ClipboardText, label: 'Pedidos' },
  { to: '/clientes', icon: Users, label: 'Clientes' }
];

export default function MobileBottomNav() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuAberto(false);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-50">
      {mainLinks.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-semibold ${isActive ? 'text-primaria' : 'text-texto'}`
          }
        >
          <Icon size={24} />
          <span>{label}</span>
        </NavLink>
      ))}

      {/* Botão do menu de usuário */}
      <div className="relative">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className={`flex flex-col items-center text-xs font-semibold transition-colors ${menuAberto ? 'text-primaria' : 'text-texto'}`}
        >
          <User size={24} />
          <span>Conta</span>
        </button>

        {/* Menu flutuante */}
        {menuAberto && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
            <NavLink
              to="/perfil"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-texto"
            >
              <User size={18} /> Perfil
            </NavLink>
            <NavLink
              to="/configuracoes"
              onClick={() => setMenuAberto(false)}
              className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm font-semibold text-texto"
            >
              <Gear size={18} /> Configurações
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-sm font-semibold text-red-500 border-t border-gray-100"
            >
              <User size={18} /> Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
