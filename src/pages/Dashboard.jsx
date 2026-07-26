import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Warning, ClipboardText, Sparkle, ChartBar } from 'phosphor-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

function inicioDoDia(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/produtos').then(({ data }) => data).catch(() => []),
      api.get('/pedidos').then(({ data }) => data).catch(() => [])
    ]).then(([prods, peds]) => {
      setProdutos(prods);
      setPedidos(peds);
      setLoading(false);
    });
  }, []);

  const produtosAtivos = produtos.filter((p) => p.ativo).length;
  const estoqueBaixo = produtos.filter((p) => p.estoque <= 5);
  const pedidosPendentes = pedidos.filter((p) => p.status === 'pendente').length;

  const agora = new Date();
  const faturamentoMes = pedidos
    .filter((p) => ['pago', 'entregue'].includes(p.status))
    .filter((p) => {
      const d = new Date(p.criadoEm);
      return d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear();
    })
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

  const cards = [
    { label: 'Produtos ativos', valor: produtosAtivos, icon: Package, cor: 'text-primaria bg-primaria/10' },
    { label: 'Estoque baixo', valor: estoqueBaixo.length, icon: Warning, cor: estoqueBaixo.length > 0 ? 'text-red-500 bg-red-50' : 'text-sucesso bg-sucesso/10' },
    { label: 'Pedidos pendentes', valor: pedidosPendentes, icon: ClipboardText, cor: 'text-secundaria bg-secundaria/10' },
    { label: 'Faturamento do mês', valor: `R$ ${faturamentoMes.toFixed(2)}`, icon: Sparkle, cor: 'text-sucesso bg-sucesso/10' }
  ];

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-primaria/20 border-t-primaria animate-spin mx-auto mb-4"></div>
        <p className="text-texto/50 text-sm">Carregando seu império...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-titulo text-4xl md:text-5xl text-primaria mb-1">
            Olá, {user?.nome?.split(' ')[0] || 'Revendedora'}!
          </h1>
          <p className="text-texto/50 text-lg">Seu império perfumado em um só lugar</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {cards.map(({ label, valor, icon: Icon, cor }) => (
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
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Warning size={20} className="text-red-500" weight="bold" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-700 text-sm">
              {estoqueBaixo.length} produto{estoqueBaixo.length > 1 ? 's' : ''} com estoque crítico
            </p>
            <p className="text-red-500/80 text-xs mt-1">
              {estoqueBaixo.slice(0, 3).map((p) => p.nome).join(', ')}
              {estoqueBaixo.length > 3 ? ` e mais ${estoqueBaixo.length - 3}...` : ''}
            </p>
            <Link to="/produtos" className="text-red-600 text-xs font-semibold underline mt-2 inline-block hover:text-red-700">
              Ver todos os produtos →
            </Link>
          </div>
        </div>
      )}

      <div className="card-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-xl flex items-center gap-2 text-texto">
            <ChartBar size={24} className="text-primaria" /> Vendas dos últimos 7 dias
          </h2>
          <span className="text-xs text-texto/40 bg-gray-50 px-3 py-1 rounded-full">
            Atualizado agora
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 h-40">
          {ultimos7Dias.map(({ dia, totalDia }, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-gray-50 rounded-lg flex items-end h-full overflow-hidden">
                <div
                  className="w-full bg-gradient-to-t from-primaria to-primaria/60 rounded-t-lg transition-all duration-500 group-hover:opacity-90"
                  style={{ height: `${Math.max(8, (totalDia / maiorValor) * 100)}%` }}
                  title={`R$ ${totalDia.toFixed(2)}`}
                />
              </div>
              <span className="text-[10px] text-texto/40 font-medium uppercase tracking-wider">
                {dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {produtos.length === 0 && pedidos.length === 0 && (
        <div className="card-lg text-center py-12 mt-8">
          <div className="w-20 h-20 rounded-full bg-secundaria/10 flex items-center justify-center mx-auto mb-4">
            <Sparkle size={40} className="text-secundaria" weight="duotone" />
          </div>
          <p className="font-titulo text-2xl text-texto mb-2">Sua jornada começa aqui!</p>
          <p className="text-texto/50 text-sm mb-6">Cadastre seu primeiro produto para ver sua vitrine ganhar vida.</p>
          <Link to="/produtos/novo" className="btn-primary inline-flex">
            Adicionar primeiro produto
          </Link>
        </div>
      )}
    </div>
  );
}
