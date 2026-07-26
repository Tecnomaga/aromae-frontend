import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignIn } from 'phosphor-react';
import { loginSchema } from '../schemas';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.senha);
      navigate('/dashboard'); // Redirecionamento correto
    } catch (err) {
      setError('root', { message: 'E-mail ou senha inválidos.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm animate-fade-in-up">
        <h1 className="font-titulo text-3xl text-primaria text-center mb-2">Aromaê</h1>
        <p className="text-center text-texto/70 mb-6">Entre para gerenciar seu império perfumado</p>

        {errors.root && <p className="text-red-500 text-sm mb-4">{errors.root.message}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              type="password" placeholder="Senha"
              {...register('senha')}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria"
            />
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
          </div>

          <button
            type="submit" disabled={isSubmitting}
            className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <SignIn size={20} /> {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Não tem uma loja? <Link to="/cadastro" className="text-primaria font-semibold">Criar agora</Link>
        </p>
      </div>
    </div>
  );
}
