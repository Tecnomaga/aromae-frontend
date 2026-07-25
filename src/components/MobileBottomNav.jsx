import { NavLink } from 'react-router-dom';
import { House, Package, ClipboardText, Users } from 'phosphor-react';

const links = [
  { to: '/dashboard', icon: House, label: 'Início' },
  { to: '/produtos', icon: Package, label: 'Produtos' },
  { to: '/pedidos', icon: ClipboardText, label: 'Pedidos' },
  { to: '/clientes', icon: Users, label: 'Clientes' }
];

export default function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-50">
      {links.map(({ to, icon: Icon, label }) => (
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
    </nav>
  );
}
