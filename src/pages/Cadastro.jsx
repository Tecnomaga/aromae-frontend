import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cadastroSchema } from '../schemas';
import { useState } from 'react';

export default function Cadastro() {
  const { registrar } = useAuth();
  const [indicadoPor, setIndicadoPor] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(cadastroSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('root', { message: '' }); // limpa erro anterior

    // Dispara o cadastro com um timeout de 15 segundos
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 15000)
    );

    try {
      await Promise.race([
        registrar(data.nome, data.email, data.senha, indicadoPor),
        timeoutPromise,
      ]);
      // Sucesso: redireciona imediatamente
      window.location.href = '/onboarding';
    } catch (err) {
      setLoading(false);
      if (err.message === 'TIMEOUT') {
        // O servidor demorou demais, mas a conta provavelmente foi criada.
        // Redireciona mesmo assim, pois o teste anterior mostrou que a conta é criada.
        window.alert('O servidor está lento, mas sua conta provavelmente foi criada. Você será redirecionado para continuar.');
        window.location.href = '/onboarding';
      } else {
        // Exibe o erro real em um alerta sonoro
        const mensagem = err.response?.data?.message || err.message || 'Erro desconhecido';
        window.alert('Erro ao criar conta: ' + mensagem);
        setError('root', { message: mensagem });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        <h1 className="font-titulo text-3xl text-primaria text-center mb-2">Criar sua loja</h1>
        <p className="text-center text-texto/70 mb-6">Comece sua jornada aromática</p>

        {errors.root && <p className="text-red-500 text-sm mb-4">{errors.root.message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input type="text" placeholder="Nome completo" {...register('nome')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>
          <div>
            <input type="email" placeholder="E-mail" {...register('email')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input type="password" placeholder="Senha (mínimo 6 caracteres)" {...register('senha')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
          </div>
          <div>
            <input type="password" placeholder="Confirmar senha" {...register('senhaConfirmacao')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
            {errors.senhaConfirmacao && <p className="text-red-500 text-xs mt-1">{errors.senhaConfirmacao.message}</p>}
          </div>
          <div>
            <input type="text" placeholder="Código de indicação (opcional)" value={indicadoPor} onChange={(e) => setIndicadoPor(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
            <p className="text-xs text-texto/40 mt-1">Se alguém te indicou, coloque o e-mail dela aqui.</p>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50">
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">Já tem uma loja? <Link to="/login" className="text-primaria font-semibold">Entrar</Link></p>
      </div>
    </div>
  );
}
