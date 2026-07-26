import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { House, Package, ClipboardText, Users, User, Gear, CreditCard, Coins, Headset } from 'phosphor-react';
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100/50 flex justify-around py-2 z-50 shadow-lg">
      {mainLinks.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard'}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs font-semibold transition-colors duration-200 ${
              isActive ? 'text-primaria' : 'text-texto/50 hover:text-texto'
            }`
          }
        >
          <Icon size={24} />
          <span className="mt-0.5">{label}</span>
        </NavLink>
      ))}

      <div className="relative">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className={`flex flex-col items-center text-xs font-semibold transition-colors duration-200 ${
            menuAberto ? 'text-primaria' : 'text-texto/50 hover:text-texto'
          }`}
        >
          <User size={24} />
          <span className="mt-0.5">Conta</span>
        </button>

        {menuAberto && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 bg-white rounded-2xl shadow-xl border border-gray-100/80 overflow-hidden animate-fade-in-up backdrop-blur-sm">
            <div className="p-2 space-y-1">
              <NavLink
                to="/perfil"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-semibold text-texto transition-colors"
              >
                <User size={18} className="text-primaria" /> Perfil
              </NavLink>
              <NavLink
                to="/planos"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-semibold text-texto transition-colors"
              >
                <CreditCard size={18} className="text-primaria" /> Planos
              </NavLink>
              <NavLink
                to="/financeiro"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-semibold text-texto transition-colors"
              >
                <Coins size={18} className="text-sucesso" /> Financeiro
              </NavLink>
              <NavLink
                to="/assinatura"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-semibold text-texto transition-colors"
              >
                <CreditCard size={18} className="text-primaria" /> Assinatura
              </NavLink>
              <NavLink
                to="/configuracoes"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-semibold text-texto transition-colors"
              >
                <Gear size={18} className="text-primaria" /> Configurações
              </NavLink>
              <NavLink
                to="/suporte"
                onClick={() => setMenuAberto(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-sm font-semibold text-texto transition-colors"
              >
                <Headset size={18} className="text-primaria" /> Suporte
              </NavLink>
            </div>
            <div className="border-t border-gray-100/50 p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-semibold text-red-500 transition-colors"
              >
                <User size={18} /> Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
