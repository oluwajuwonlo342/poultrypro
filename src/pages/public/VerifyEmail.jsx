import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sprout, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing from the link.');
      return;
    }

    api
      .post('/auth/verify-email', { token })
      .then((res) => {
        setStatus('success');
        setMessage(res.data?.message || 'Your email has been verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Invalid or expired verification token.');
      });
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 text-brand-dark">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold">PoultryPro</span>
        </div>

        <div className="mt-6 flex justify-center">
          {status === 'verifying' && <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />}
          {status === 'success' && <CheckCircle2 className="h-12 w-12 text-brand-primary" />}
          {status === 'error' && <XCircle className="h-12 w-12 text-red-600" />}
        </div>

        <h1 className="mt-4 text-xl font-bold text-gray-900">
          {status === 'verifying' && 'Verifying Email'}
          {status === 'success' && 'Email Verified!'}
          {status === 'error' && 'Verification Failed'}
        </h1>

        <p className="mt-2 text-sm text-gray-600">{message}</p>

        {status !== 'verifying' && (
          <Link
            to="/login"
            className="mt-6 inline-block w-full rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
          >
            Continue to Sign In
          </Link>
        )}
      </div>
    </div>
  );
}