import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function BillingSubscription() {
  const [plans, setPlans] = useState([]);
  const [statusBanner, setStatusBanner] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { subscription, setSubscription } = useAuth();

  useEffect(() => {
    api.get('/billing/plans').then((res) => setPlans(res.data));

    const ref = searchParams.get('reference');
    if (ref) {
      api
        .get(`/billing/verify/${ref}`)
        .then((res) => {
          setSubscription(res.data.subscription);
          setStatusBanner('Payment verified! Your PoultryPro subscription is now active.');
          setSearchParams({});
        })
        .catch(() => setStatusBanner('Payment verification pending or failed.'));
    }
  }, []);

  const handleUpgrade = async (planCode) => {
    const { data } = await api.post('/billing/initialize', { planCode, billingCycle: 'monthly' });
    window.location.href = data.authorizationUrl;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-dark">Subscription & Paystack Billing</h1>
        <p className="text-sm text-gray-500">
          Current Active Plan: <strong className="text-brand-primary">{subscription?.planCode || 'FREE'}</strong>
        </p>
      </div>

      {statusBanner && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-light p-4 text-sm font-semibold text-brand-dark">
          <CheckCircle2 className="h-5 w-5 text-brand-primary" /> {statusBanner}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p._id} className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div>
              <h3 className="text-lg font-extrabold text-brand-dark">{p.name}</h3>
              <p className="mt-2 text-2xl font-extrabold text-gray-900">
                ₦{p.monthlyPriceNGN.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span>
              </p>
              <p className="mt-2 text-xs text-gray-500">{p.description}</p>
            </div>
            <button
              disabled={p.code === 'FREE' || subscription?.planCode === p.code}
              onClick={() => handleUpgrade(p.code)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-xs font-bold text-white hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-500"
            >
              <CreditCard className="h-4 w-4" />
              {subscription?.planCode === p.code ? 'Current Plan' : p.code === 'FREE' ? 'Default Tier' : 'Pay with Paystack'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}