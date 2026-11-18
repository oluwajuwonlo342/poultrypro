import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
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

        <h1 className="mt-6 text-center text-xl font-bold text-gray-900">Reset Your Password</h1>
        <p className="mt-1 text-center text-xs text-gray-500">
          Enter your registered email address and we&apos;ll send you a reset link.
        </p>

        {message && (
          <div className="mt-4 rounded-xl bg-brand-light p-3 text-xs font-medium text-brand-dark">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="relative">
            <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@example.com"
              className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-brand-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}