import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SignIn, Eye, EyeSlash } from 'phosphor-react';
import { loginSchema } from '../schemas';
import api from '../services/api';

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  useEffect(() => {
    api.get('/health').catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('root', { message: '' });
    try {
      await login(data.email, data.senha, rememberMe);
      window.location.href = '/dashboard';
    } catch (err) {
      if (err.code === 'ECONNABORTED' || !err.response) {
        setError('root', { message: 'Servidor demorou. Tente novamente.' });
      } else if (err.response?.status === 429) {
        setError('root', { message: 'Muitas tentativas. Aguarde 15 minutos.' });
      } else {
        setError('root', { message: 'E-mail ou senha inválidos.' });
      }
    } finally {
      setLoading(false);
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
            <input type="email" placeholder="E-mail" {...register('email')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Senha" {...register('senha')} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primaria" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-texto/40 hover:text-texto">
              {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-texto/60 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-primaria rounded focus:ring-primaria" />
              Lembrar de mim
            </label>
            <Link to="/recuperar-senha" className="text-sm text-primaria hover:underline">Esqueci minha senha</Link>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primaria text-white py-3 rounded-lg font-semibold hover:bg-primaria/90 transition flex items-center justify-center gap-2 disabled:opacity-50">
            <SignIn size={20} /> {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm mt-6">Não tem uma loja? <Link to="/cadastro" className="text-primaria font-semibold">Criar agora</Link></p>
      </div>
    </div>
  );
}
