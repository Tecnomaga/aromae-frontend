import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendUp, Clock, CheckCircle, Coin, Percent, CurrencyDollar, X } from 'phosphor-react';
import api from '../services/api';

export default function Financeiro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [dados, setDados] = useState({ totalBruto: 0, totalLiquido: 0, comissaoTotal: 0, historico: [] });

  useEffect(() => {
    api.get('/financeiro/extrato')
      .then(({ data }) => {
        setDados(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro ao carregar financeiro:', err);
        setErro('Não foi possível carregar os dados financeiros.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando seu financeiro...</div>;
  if (erro) return <div className="p-8 text-center text-red-500">{erro}</div>;

  const { totalBruto, totalLiquido, comissaoTotal, historico } = dados;

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in-up">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-titulo text-3xl text-primaria mb-2">Minha Conta</h1>
          <p className="text-texto/50 text-sm">Resumo financeiro dos últimos 30 dias.</p>
        </div>
        <button onClick={() => navigate(-1)} className="text-texto/40 hover:text-texto p-1">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-texto/50 text-xs font-semibold uppercase">Total Vendido</p>
            <p className="text-2xl font-bold text-texto">R$ {totalBruto.toFixed(2)}</p>
            <p className="text-xs text-texto/40">Bruto (valor cheio)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primaria/10 flex items-center justify-center">
            <CurrencyDollar size={24} className="text-primaria" weight="bold" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-texto/50 text-xs font-semibold uppercase">Recebido (Líquido)</p>
            <p className="text-2xl font-bold text-sucesso">R$ {totalLiquido.toFixed(2)}</p>
            <p className="text-xs text-texto/40">Já enviado para seu Pix</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sucesso/10 flex items-center justify-center">
            <TrendUp size={24} className="text-sucesso" weight="bold" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-texto/50 text-xs font-semibold uppercase">Comissão Plataforma</p>
            <p className="text-2xl font-bold text-texto">R$ {comissaoTotal.toFixed(2)}</p>
            <p className="text-xs text-texto/40">Taxa descontada</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            <Percent size={24} className="text-gray-500" weight="bold" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-lg">Histórico de repasses</h2>
          <span className="text-xs text-texto/40">Últimos 30 dias</span>
        </div>
        
        {historico.length === 0 ? (
          <div className="p-8 text-center text-texto/40">Nenhum repasse registrado nos últimos 30 dias.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {historico.map((item, index) => (
              <li key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
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
                <div className="flex flex-col items-end">
                  <p className="font-bold text-sucesso">+ R$ {item.valorLiquido.toFixed(2)}</p>
                  <p className="text-[10px] text-texto/30">Bruto: R$ {item.valorBruto.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
