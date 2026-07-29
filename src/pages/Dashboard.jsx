import { Link } from 'react-router-dom';
import { Package, Warning, ClipboardText, Sparkle, ChartBar, TrendUp, Share as ShareIcon } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-titulo text-4xl md:text-5xl text-primaria mb-1">Olá, {user?.nome?.split(' ')[0] || 'Revendedora'}!</h1>
          <p className="text-texto/50 text-lg">Seu império perfumado em um só lugar</p>
        </div>
        <Link to="/planos" className="btn-primary text-sm px-4 py-2">Ver planos</Link>
      </div>

      {user?.slug && (
        <div className="card-sm mb-8 flex items-center justify-between">
          <div>
            <p className="font-semibold">Sua vitrine está no ar!</p>
            <p className="text-sm text-texto/50">/loja/{user.slug}</p>
          </div>
          <button
            onClick={() => {
              const url = `${window.location.origin}/loja/${user.slug}`;
              navigator.clipboard.writeText(url);
            }}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <ShareIcon size={18} /> Copiar link
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { label: 'Produtos ativos', valor: '...', icon: Package, cor: 'text-primaria bg-primaria/10' },
          { label: 'Estoque baixo', valor: '...', icon: Warning, cor: 'text-sucesso bg-sucesso/10' },
          { label: 'Pedidos pendentes', valor: '...', icon: ClipboardText, cor: 'text-secundaria bg-secundaria/10' },
          { label: 'Faturamento do mês', valor: 'R$ 0,00', icon: Sparkle, cor: 'text-sucesso bg-sucesso/10' },
          { label: 'Lucro líquido (mês)', valor: 'R$ 0,00', icon: TrendUp, cor: 'text-sucesso bg-sucesso/10' },
        ].map(({ label, valor, icon: Icon, cor }) => (
          <div key={label} className="card-sm hover:shadow-lg transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cor}`}>
              <Icon size={24} weight="bold" />
            </div>
            <p className="text-3xl font-bold text-texto">{valor}</p>
            <p className="text-sm text-texto/50 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="card-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl flex items-center gap-2 text-texto"><ChartBar size={24} className="text-primaria" /> Vendas dos últimos 7 dias</h2>
          <span className="text-xs text-texto/40 bg-gray-50 px-3 py-1 rounded-full">Atualizado agora</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-50 rounded-lg flex items-end h-full overflow-hidden">
                <div className="w-full bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg" style={{ height: '10%' }} />
              </div>
              <span className="text-[10px] text-texto/40 font-medium uppercase tracking-wider">-</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-sm p-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primaria/10 to-secundaria/10 flex items-center justify-center mb-6">
          <Package size={40} className="text-primaria/60" weight="duotone" />
        </div>
        <h3 className="font-titulo text-xl text-texto mb-2">Sua jornada começa aqui!</h3>
        <p className="text-texto/50 mb-6">Cadastre seu primeiro perfume para ver sua vitrine ganhar vida.</p>
        <Link to="/produtos/novo" className="btn-primary inline-flex">Adicionar primeiro produto</Link>
      </div>
    </div>
  );
}
