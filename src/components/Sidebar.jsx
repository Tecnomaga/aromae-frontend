import { NavLink } from 'react-router-dom';
import { House, Package, ClipboardText, Users, User, Gear, Coins, Headset } from 'phosphor-react';

const links = [
  { to: '/dashboard', icon: House, label: 'Início' },
  { to: '/produtos', icon: Package, label: 'Produtos' },
  { to: '/pedidos', icon: ClipboardText, label: 'Pedidos' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/perfil', icon: User, label: 'Perfil' },
  { to: '/configuracoes', icon: Gear, label: 'Config.' },
  { to: '/financeiro', icon: Coins, label: 'Financeiro' },
  { to: '/suporte', icon: Headset, label: 'Suporte' }
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-100 py-8 px-4">
      <div className="font-titulo text-2xl text-primaria text-center mb-10">Aromaê</div>
      <nav className="flex-1 space-y-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive ? 'bg-primaria/10 text-primaria' : 'text-texto hover:bg-gray-50'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
