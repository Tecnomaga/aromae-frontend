import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Storefront, CheckCircle, XCircle } from 'phosphor-react';

export default function Admin() {
  const [revendedoras, setRevendedoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Pega o e-mail do usuário logado
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) setUserEmail(user.email);

    const token = localStorage.getItem('token');
    if (!token) {
      setErro('Você precisa estar logado para acessar o painel.');
      setLoading(false);
      return;
    }

    api.get('/admin/revendedoras')
      .then(({ data }) => {
        setRevendedoras(data);
        setLoading(false);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 403) {
          setErro(`Acesso negado. E-mail logado: ${userEmail || 'desconhecido'}. Verifique o adminController.js.`);
        } else if (status === 401) {
          setErro('Sessão expirada. Faça login novamente.');
        } else {
          setErro('Erro ao carregar as revendedoras.');
        }
        setLoading(false);
      });
  }, [userEmail]);

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.patch(`/admin/revendedoras/${id}`);
      setRevendedoras(revendedoras.map(r => r._id === id ? data : r));
      toast.success('Status alterado!');
    } catch (err) {
      toast.error('Erro ao alterar status.');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando painel admin...</div>;
  if (erro) return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <p className="text-red-500 font-semibold">{erro}</p>
      <button 
        onClick={() => window.location.href = '/login'}
        className="mt-4 bg-primaria text-white px-6 py-2 rounded-lg"
      >
        Ir para Login
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="font-titulo text-3xl text-primaria mb-6">Painel Admin Aromaê</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-texto/70">
            <tr>
              <th className="px-4 py-3">Loja</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {revendedoras.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-semibold flex items-center gap-2">
                  <Storefront size={16} className="text-primaria" /> {r.nomeLoja || 'Sem nome'}
                </td>
                <td className="px-4 py-3 text-texto/70">{r.email}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${r.ativo ? 'bg-sucesso/20 text-sucesso' : 'bg-red-100 text-red-500'}`}>
                    {r.ativo ? <CheckCircle size={14} /> : <XCircle size={14} />} {r.ativo ? 'Ativa' : 'Bloqueada'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => toggleStatus(r._id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${r.ativo ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-sucesso/10 text-sucesso hover:bg-sucesso/20'}`}
                  >
                    {r.ativo ? 'Bloquear' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {revendedoras.length === 0 && <p className="p-8 text-center text-texto/50">Nenhuma revendedora cadastrada ainda.</p>}
      </div>
      <p className="mt-4 text-xs text-texto/50 text-center">Apenas o administrador pode acessar essa página.</p>
    </div>
  );
}
