import { X } from 'phosphor-react';

export default function DetalhesProdutoModal({ produto, onClose }) {
  if (!produto) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-pop">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-titulo text-xl text-primaria">{produto.nome}</h3>
          <button onClick={onClose} className="text-texto/40 hover:text-texto">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-48 bg-gray-100 rounded-xl overflow-hidden">
            {produto.fotos?.[0] ? (
              <img src={produto.fotos[0]} alt={produto.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-texto/30">
                Sem imagem
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-texto/50">Marca</p>
            <p className="font-semibold">{produto.marca}</p>
          </div>
          <div>
            <p className="text-sm text-texto/50">Descrição</p>
            <p className="text-sm text-texto/70 whitespace-pre-wrap">{produto.descricao || 'Sem descrição cadastrada.'}</p>
          </div>
          <div>
            <p className="text-sm text-texto/50">Preço</p>
            <p className="text-2xl font-bold text-primaria">R$ {produto.preco?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
