// client/src/pages/public/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sprout } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register, handleSubmit } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      return setError('Passwords do not match.');
    }
    setLoading(true);
    setError('');
    try {
      await registerUser(values);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-brand-dark">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold">PoultryPro</span>
        </div>
        <h1 className="mt-5 text-center text-xl font-bold text-gray-900">Create Your Farm Owner Account</h1>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-700">Full Name *</label>
            <input
              required
              {...register('fullName')}
              placeholder="e.g., Adewale Ogunleye"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700">Email Address *</label>
            <input
              type="email"
              required
              {...register('email')}
              placeholder="adewale@farm.ng"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700">Phone Number *</label>
            <input
              required
              {...register('phone')}
              placeholder="+234 803 123 4567"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Password *</label>
              <input
                type="password"
                minLength={6}
                required
                {...register('password')}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Confirm Password *</label>
              <input
                type="password"
                minLength={6}
                required
                {...register('confirmPassword')}
                className="mt-1 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Creating Account...' : 'Continue to Farm Setup'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}