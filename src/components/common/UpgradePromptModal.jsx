import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UpgradePromptModal() {
  const [limitMessage, setLimitMessage] = useState('');
  const { user, subscription } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLimitEvent = (event) => {
      setLimitMessage(event.detail?.message || 'You have reached a limit on your current subscription plan.');
    };
    window.addEventListener('poultrypro:plan-limit', handleLimitEvent);
    return () => window.removeEventListener('poultrypro:plan-limit', handleLimitEvent);
  }, []);

  if (!limitMessage) return null;

  const isOwner = user?.role === 'farm_owner';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <button
          onClick={() => setLimitMessage('')}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close upgrade prompt"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <Crown className="h-6 w-6" />
        </div>

        <span className="mt-4 inline-block rounded-full bg-brand-light px-3 py-0.5 text-xs font-bold text-brand-dark">
          Current Tier: {subscription?.planCode || 'FREE'}
        </span>

        <h2 className="mt-2 text-xl font-extrabold text-brand-dark">Upgrade Required to Unlock</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{limitMessage}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={() => setLimitMessage('')}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Maybe Later
          </button>
          {isOwner && (
            <button
              onClick={() => {
                setLimitMessage('');
                navigate('/dashboard/billing');
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-dark"
            >
              View Upgrade Plans <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}