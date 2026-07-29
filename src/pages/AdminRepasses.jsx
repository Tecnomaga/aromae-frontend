import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AdminRepasses() {
  const [repasses, setRepasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    try {
      const { data } = await api.get('/admin/repasses-pendentes');
      setRepasses(data);
    } catch (err) {
      toast.error('Erro ao carregar repasses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const marcarComoPago = async (id) => {
    try {
      await api.patch(`/admin/repasses-pendentes/${id}`);
      toast.success('Marcado como pago!');
      carregar();
    } catch {
      toast.error('Erro ao marcar.');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando repasses...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in-up">
      <h1 className="font-titulo text-3xl text-primaria mb-6">Painel de Repasses</h1>
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
