import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Sprout, Lock } from 'lucide-react';
import api from '../../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      setSuccess(data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-brand-dark">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold">PoultryPro</span>
        </div>

        <h1 className="mt-6 text-center text-xl font-bold text-gray-900">Choose a New Password</h1>

        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">{error}</div>}
        {success && <div className="mt-4 rounded-xl bg-brand-light p-3 text-xs font-medium text-brand-dark">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="relative">
            <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min 6 characters)"
              className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs">
          <Link to="/login" className="font-semibold text-brand-primary hover:underline">
            Return to Login
          </Link>
        </p>
      </div>
    </div>
  );
}