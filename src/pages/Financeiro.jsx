import { useEffect, useState } from 'react';
import { TrendUp, ArrowRight, Clock, CheckCircle } from 'phosphor-react';
import api from '../services/api';

export default function Financeiro() {
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de busca de dados (Seu backend ainda não tem rota de extrato, mas já deixamos pronta)
    // Você pode substituir isso futuramente por: api.get('/financeiro/extrato')
    setLoading(true);
    setTimeout(() => {
      setSaldo(152.50); // Exemplo de saldo a receber
      setHistorico([
        { id: '1', data: '25/07/2026', valor: 47.50, tipo: 'Venda via Pix - Perfume X' },
        { id: '2', data: '24/07/2026', valor: 50.00, tipo: 'Venda via Pix - Perfume Y' },
        { id: '3', data: '23/07/2026', valor: 55.00, tipo: 'Venda via Pix - Perfume Z' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando seu financeiro...</div>;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <h1 className="font-titulo text-3xl text-primaria mb-2">Minha Conta</h1>
      <p className="text-texto/50 text-sm mb-6">Acompanhe seu saldo e histórico de repasses.</p>

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-texto/50 text-sm">Saldo disponível para saque</p>
          <p className="text-3xl font-bold text-sucesso">R$ {saldo.toFixed(2)}</p>
        </div>
        <div className="w-14 h-14 rounded-xl bg-sucesso/10 flex items-center justify-center">
          <TrendUp size={24} className="text-sucesso" weight="bold" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg">Histórico de repasses</h2>
          <span className="text-xs text-texto/40">Últimos 30 dias</span>
        </div>
        
        {historico.length === 0 ? (
          <div className="p-8 text-center text-texto/40">Nenhum repasse registrado ainda.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {historico.map((item) => (
              <li key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-sucesso">
                    <CheckCircle size={18} weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-texto">{item.tipo}</p>
                    <p className="text-xs text-texto/40 flex items-center gap-1">
                      <Clock size={12} /> {item.data}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-sucesso">+ R$ {item.valor.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
