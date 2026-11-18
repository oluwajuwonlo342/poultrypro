// client/src/pages/public/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sprout, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data.user.role === 'super_admin') return navigate('/admin');
      if (data.requiresOnboarding) return navigate('/onboarding');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link to="/" className="flex items-center justify-center gap-2 text-brand-dark">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold">PoultryPro</span>
        </Link>
        <h1 className="mt-6 text-center text-xl font-bold text-gray-900">Sign in to your farm account</h1>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                {...register('email')}
                placeholder="farmer@example.com"
                className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-brand-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative mt-1">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                {...register('password')}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-bold text-brand-primary hover:underline">
            Create Free Account
          </Link>
        </p>
      </div>
    </div>
  );
}