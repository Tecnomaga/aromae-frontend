import api from '../services/api';
import toast from 'react-hot-toast';

const handleAssinar = async (tipo) => {
  try {
    const response = await api.post('/payments/subscribe', { tipoPlano: tipo });
    window.location.href = response.data.checkoutUrl;
  } catch (error) {
    toast.error('Erro ao gerar link de pagamento.');
  }
};

// No render:
<div className="flex gap-4 mt-4">
  <button onClick={() => handleAssinar('mensal')} className="flex-1 bg-primaria text-white py-2 rounded-lg">
    Mensal - R$ 19,90
  </button>
  <button onClick={() => handleAssinar('anual')} className="flex-1 bg-green-600 text-white py-2 rounded-lg">
    Anual - R$ 199,00 (economize 2 meses!)
  </button>
</div>
