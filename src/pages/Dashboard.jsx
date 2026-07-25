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

  if (loading) return <p className="text-center py-10">Carregando seu panorama...</p>;

  return (
    <div>
      <h1 className="font-titulo text-3xl text-primaria mb-1">
        Olá{user?.nome ? `, ${user.nome.split(' ')[0]}` : ''}!
      </h1>
      <p className="text-texto/60 mb-6">Aqui está o panorama do seu império perfumado hoje.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, valor, icon: Icon, cor }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${cor}`}>
              <Icon size={20} weight="bold" />
            </div>
            <p className="text-2xl font-bold">{valor}</p>
            <p className="text-xs text-texto/60">{label}</p>
          </div>
        ))}
      </div>

      {estoqueBaixo.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Warning size={22} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-red-600 text-sm">
              {estoqueBaixo.length} produto{estoqueBaixo.length > 1 ? 's' : ''} com estoque baixo
            </p>
            <p className="text-red-500/80 text-xs mt-0.5">
              {estoqueBaixo.slice(0, 3).map((p) => p.nome).join(', ')}
              {estoqueBaixo.length > 3 ? '...' : ''}
            </p>
            <Link to="/produtos" className="text-red-600 text-xs font-semibold underline mt-1 inline-block">
              Ver produtos
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
          <ChartBar size={22} className="text-primaria" /> Vendas dos últimos 7 dias
        </h2>
        <div className="flex items-end justify-between gap-2 h-32">
          {ultimos7Dias.map(({ dia, totalDia }, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-primaria/10 rounded-t-md flex items-end" style={{ height: '100%' }}>
                <div
                  className="w-full bg-primaria rounded-t-md transition-all"
                  style={{ height: `${Math.max(4, (totalDia / maiorValor) * 100)}%` }}
                  title={`R$ ${totalDia.toFixed(2)}`}
                />
              </div>
              <span className="text-[10px] text-texto/50">
                {dia.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {produtos.length === 0 && pedidos.length === 0 && (
        <div className="text-center py-10 mt-6 bg-white rounded-2xl shadow-sm">
          <Sparkle size={40} className="mx-auto text-secundaria mb-3" />
          <p className="font-semibold">Sua jornada começa aqui!</p>
          <p className="text-texto/60 text-sm mt-1">Cadastre seu primeiro produto para ver a vitrine ganhar vida.</p>
          <Link to="/produtos/novo" className="text-primaria font-semibold underline mt-3 inline-block">
            Adicionar produto
          </Link>
        </div>
      )}
    </div>
  );
}
