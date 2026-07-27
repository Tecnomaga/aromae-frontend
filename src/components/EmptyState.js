import { Link } from 'react-router-dom';
import { Package, Users, ClipboardText, SmileySad } from 'phosphor-react';

const icons = {
  produtos: Package,
  clientes: Users,
  pedidos: ClipboardText,
  default: SmileySad,
};

export default function EmptyState({ type = 'default', title, message, linkTo, linkText }) {
  const Icon = icons[type] || icons.default;
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-12 text-center animate-fade-in-up">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primaria/10 to-secundaria/10 flex items-center justify-center mb-6">
        <Icon size={40} className="text-primaria/60" weight="duotone" />
      </div>
      <h3 className="font-titulo text-xl text-texto mb-2">{title || 'Nada por aqui'}</h3>
      <p className="text-texto/50 mb-6 max-w-xs mx-auto">{message || 'Comece agora mesmo!'}</p>
      {linkTo && (
        <Link to={linkTo} className="btn-primary inline-flex">
          {linkText || 'Começar'}
        </Link>
      )}
    </div>
  );
}
