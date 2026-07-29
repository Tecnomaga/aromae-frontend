import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminRepasses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [repasses, setRepasses] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.email !== 'aromaevitrine@gmail.com') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const carregarDados = async () => {
    try {
      const [rep, pen] = await Promise.all([
        api.get('/admin/repasses-pendentes'),
        api.get('/admin/pedidos-pendentes-pix')
      ]);
      setRepasses(rep.data);
      setPendentes(pen.data);
    } catch (err) {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.email === 'aromaevitrine@gmail.com') {
      carregarDados();
    }
  }, [user]);

  const marcarComoPago = async (id) => {
    try {
      await api.patch(`/admin/repasses-pendentes/${id}`);
      toast.success('Marcado como pago!');
      carregarDados();
    } catch {
      toast.error('Erro ao marcar.');
    }
  };

  const verificarPagamento = async (id) => {
    try {
      const { data } = await api.post(`/admin/verificar-pagamento/${id}`);
      if (data.status === 'approved') {
        toast.success('Pagamento confirmado!');
      } else {
        toast('Ainda não aprovado.');
      }
      carregarDados();
    } catch (err) {
      toast.error('Erro ao verificar pagamento.');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <h1 className="font-titulo text-3xl text-primaria mb-6">Painel de Administração</h1>

      {/* Pedidos pendentes de confirmação */}
      <h2 className="font-bold text-xl mb-4">Pedidos Pendentes (Pix não confirmado)</h2>
      {pendentes.length === 0 ? (
        <p className="text-texto/50 mb-6">Nenhum pedido pendente.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {pendentes.map((ped) => (
            <div key={ped._id} className="bg-white p-4 rounded-2xl shadow-sm">
              <p><strong>Cliente:</strong> {ped.cliente?.nome || 'N/A'}</p>
              <p><strong>Valor:</strong> R$ {ped.total?.toFixed(2)}</p>
              <p><strong>Status:</strong> Pendente</p>
              <button
                onClick={() => verificarPagamento(ped._id)}
                className="mt-2 bg-primaria text-white px-4 py-2 rounded-xl font-semibold hover:bg-primaria/90 transition"
              >
                Verificar Pagamento
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Repasses pendentes */}
      <h2 className="font-bold text-xl mb-4">Repasses Pendentes</h2>
      {repasses.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center text-texto/50">
          Nenhum repasse pendente no momento.
        </div>
      ) : (
        <div className="space-y-4">
          {repasses.map((rep) => (
            <div key={rep._id} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Vendedora:</strong> {rep.vendedora?.nomeLoja || 'N/A'}</p>
                  <p><strong>Cliente:</strong> {rep.cliente?.nome || 'N/A'}</p>
                  <p><strong>Produto:</strong> {rep.itens?.[0]?.produto?.nome || 'N/A'}</p>
                  <p><strong>Total:</strong> R$ {rep.total?.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Chave Pix:</strong> {rep.vendedora?.chavePix || 'Não cadastrada'}</p>
                  <p><strong>Endereço:</strong> {rep.endereco || 'N/A'}</p>
                  <p><strong>Valor a Repassar:</strong> R$ {rep.totalLiquido?.toFixed(2)}</p>
                  <p><strong>Comissão:</strong> {rep.comissao}%</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => marcarComoPago(rep._id)}
                  className="bg-sucesso text-white px-4 py-2 rounded-xl font-semibold hover:bg-sucesso/90 transition"
                >
                  Marcar como Pago
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
