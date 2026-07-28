import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Warning, ClipboardText, Sparkle, ChartBar, TrendUp, Rocket } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Skeleton, { CardSkeleton } from '../components/Skeleton'; // <-- importação corrigida
import EmptyState from '../components/EmptyState';

function inicioDoDia(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [lucro, setLucro] = useState({ faturamentoBruto: 0, custoTotal: 0, lucroLiquido: 0 });
  const [loading, setLoading] = useState(true);
  const [mostrarOnboarding, setMostrarOnboarding] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, peds, lucroData] = await Promise.all([
          api.get('/produtos').then(({ data }) => data).catch(() => []),
          api.get('/pedidos').then(({ data }) => data).catch(() => []),
          api.get('/relatorios/lucro-mensal').then(({ data }) => data).catch(() => ({})),
        ]);
        setProdutos(prods);
        setPedidos(peds);
        setLucro(lucroData);
        if (prods.length > 0) setMostrarOnboarding(false);
      } catch (error) {
        console.warn('⚠️ Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const produtosAtivos = produtos.filter((p) => p.ativo).length;
  const estoqueBaixo = produtos.filter((p) => p.estoque <= 5);
  const pedidosPendentes = pedidos.filter((p) => p.status === 'pendente').length;
  const agora = new Date();
  const faturamentoMes = pedidos
    .filter((p) => ['pago', 'entregue'].includes(p.status))
    .filter((p) => new Date(p.criadoEm).getMonth() === agora.getMonth())
    .reduce((soma, p) => soma + (p.total || 0), 0);

  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const dia = inicioDoDia(new Date());
    dia.setDate(dia.getDate() - (6 - i));
    const totalDia = pedidos
      .filter((p) => ['pago', 'entregue'].includes(p.status))
      .filter((p) => inicioDoDia(p.criadoEm).getTime() === dia.getTime())
      .reduce((soma, p) => soma + (p.total || 0), 0);
    return { dia, totalDia };
  });
  const maiorValor = Math.max(1, ...ultimos7Dias.map((d) => d.totalDia));

  if (loading) return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card-sm space-y-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      <div className="card-lg">
        <Skeleton className="h-6 w-40 mb-4" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-titulo text-4xl md:text-5xl text-primaria mb-1">Olá, {user?.nome?.split(' ')[0] || 'Revendedora'}!</h1>
          <p className="text-texto/50 text-lg">Seu império perfumado em um só lugar</p>
        </div>
        <Link to="/planos" className="btn-primary text-sm px-4 py-2">Ver planos</Link>
      </div>

      {mostrarOnboarding && (
        <div className="card-lg bg-gradient-to-br from-primaria/5 to-secundaria/5 border-2 border-primaria/30 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-primaria/10 text-9xl -mr-6 -mt-6 select-none"><Rocket size={128} weight="duotone" /></div>
          <div className="relative z-10">
            <h2 className="font-titulo text-2xl text-primaria mb-2">🚀 Primeiros passos!</h2>
            <p className="text-texto/70 text-sm mb-4">Siga essas 3 etapas para começar a vender hoje mesmo:</p>
            <ul className="space-y-2 text-sm font-medium text-texto/80">
              <li className="flex items-center gap-2">1️⃣ <span>Cadastre seu primeiro perfume (com foto!) em <Link to="/produtos/novo" className="text-primaria underline">Produtos</Link>.</span></li>
              <li className="flex items-center gap-2">2️⃣ <span>Compartilhe sua vitrine no WhatsApp em <Link to="/perfil" className="text-primaria underline">Meu Perfil</Link>.</span></li>
              <li className="flex items-center gap-2">3️⃣ <span>Cadastre sua chave Pix em <Link to="/perfil/editar" className="text-primaria underline">Editar Perfil</Link> para receber os pagamentos.</span></li>
            </ul>
            <button onClick={() => setMostrarOnboarding(false)} className="mt-4 text-xs text-texto/40 underline">Fechar dicas</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {[
          { label: 'Produtos ativos', valor: produtosAtivos, icon: Package, cor: 'text-primaria bg-primaria/10' },
          { label: 'Estoque baixo', valor: estoqueBaixo.length, icon: Warning, cor: estoqueBaixo.length > 0 ? 'text-red-500 bg-red-50' : 'text-sucesso bg-sucesso/10' },
          { label: 'Pedidos pendentes', valor: pedidosPendentes, icon: ClipboardText, cor: 'text-secundaria bg-secundaria/10' },
          { label: 'Faturamento do mês', valor: faturamentoMes > 0 ? `R$ ${faturamentoMes.toFixed(2)}` : 'R$ 0,00', icon: Sparkle, cor: 'text-sucesso bg-sucesso/10' },
          { label: 'Lucro líquido (mês)', valor: lucro?.lucroLiquido > 0 ? `R$ ${lucro.lucroLiquido.toFixed(2)}` : 'R$ 0,00', icon: TrendUp, cor: 'text-sucesso bg-sucesso/10' },
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

      {estoqueBaixo.length > 0 && (
        <div className="card-sm bg-red-50/80 border-red-200 mb-8 flex items-start gap-4 p-5">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0"><Warning size={20} className="text-red-500" weight="bold" /></div>
          <div className="flex-1">
            <p className="font-semibold text-red-700 text-sm">{estoqueBaixo.length} produto{estoqueBaixo.length > 1 ? 's' : ''} com estoque crítico</p>
            <Link to="/produtos" className="text-red-600 text-xs font-semibold underline mt-2 inline-block hover:text-red-700">Ver todos os produtos →</Link>
          </div>
        </div>
      )}

      <div className="card-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl flex items-center gap-2 text-texto"><ChartBar size={24} className="text-primaria" /> Vendas dos últimos 7 dias</h2>
          <span className="text-xs text-texto/40 bg-gray-50 px-3 py-1 rounded-full">Atualizado agora</span>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {ultimos7Dias.map(({ dia, totalDia }, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-gray-50 rounded-lg flex items-end h-full overflow-hidden">
                <div className="w-full bg-gradient-to-t from-primaria to-primaria/60 rounded-t-lg transition-all duration-500 group-hover:opacity-90" style={{ height: `${Math.max(8, (totalDia / maiorValor) * 100)}%` }} title={`R$ ${totalDia.toFixed(2)}`} />
              </div>
              <span className="text-[10px] text-texto/40 font-medium uppercase tracking-wider">{dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
            </div>
          ))}
        </div>
      </div>
      
      {produtos.length === 0 && pedidos.length === 0 && (
        <div className="mt-8">
          <EmptyState
            type="produtos"
            title="Sua jornada começa aqui!"
            message="Cadastre seu primeiro perfume para ver sua vitrine ganhar vida."
            linkTo="/produtos/novo"
            linkText="Adicionar primeiro produto"
          />
        </div>
      )}
    </div>
  );
}
