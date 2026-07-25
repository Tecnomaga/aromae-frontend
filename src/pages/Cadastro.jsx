import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { cadastroSchema } from '../schemas';

export default function Cadastro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(cadastroSchema)
  });

  const onSubmit = async (data) => {
    try {
      await registrar(data.nome, data.email, data.senha);
      navigate('/onboarding');
    } catch (err) {
      setError('root', { message: err.response?.data?.message || 'Erro ao criar conta.' });
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
            <input
              type="text" placeholder="Nome completo"
              {...register('nome')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <input
              type="email" placeholder="E-mail"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password" placeholder="Senha (mínimo 6 caracteres)"
              {...register('senha')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Já tem uma loja? <Link to="/login" className="text-primaria font-semibold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
