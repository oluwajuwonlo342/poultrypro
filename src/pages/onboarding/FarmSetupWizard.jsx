import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sprout, Building2, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function FarmSetupWizard() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { farmType: 'Broiler', poultryHousesCount: 1 },
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { setFarms, setRequiresOnboarding } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setSubmitting(true);
    setErrorMsg('');
    try {
      const { data } = await api.post('/farms', values);
      setFarms([data]);
      setRequiresOnboarding(false);
      localStorage.setItem('poultrypro_active_farm_id', data._id);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Unable to create farm. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary text-white">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Step 1 of 1 — Farm Setup</span>
            <h1 className="text-2xl font-extrabold text-brand-dark">Configure Your First Poultry Farm</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Your batches, feed inventory, daily logs, and financial records will be organized under this farm.
        </p>

        {errorMsg && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Farm Name *</label>
              <input
                {...register('name', { required: 'Farm name is required' })}
                placeholder="e.g., GreenPasture Poultry Ventures"
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Primary Farm Type *</label>
              <select
                {...register('farmType')}
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              >
                <option value="Broiler">Broiler Farming</option>
                <option value="Layer">Layer Farming (Egg Production)</option>
                <option value="Cockerel">Cockerel Farming</option>
                <option value="Turkey">Turkey Farming</option>
                <option value="Mixed Poultry">Mixed Poultry Operations</option>
              </select>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">City / State Location *</label>
              <input
                {...register('location', { required: 'Location is required' })}
                placeholder="e.g., Ibadan, Oyo State"
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Number of Poultry Houses / Pens *</label>
              <input
                type="number"
                min="1"
                {...register('poultryHousesCount', { required: true, min: 1 })}
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Full Farm Address *</label>
            <input
              {...register('address', { required: 'Address is required' })}
              placeholder="e.g., Plot 14, Moniya-Iseyin Road, Akinyele LGA"
              className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Farm Size / Capacity</label>
              <input
                {...register('farmSize')}
                placeholder="e.g., 5,000 Birds / 2 Acres"
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Farm Contact Phone</label>
              <input
                {...register('contactPhone')}
                placeholder="e.g., +234 803 000 0000"
                className="mt-1.5 w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-dark disabled:opacity-60"
          >
            <Building2 className="h-4 w-4" />
            {submitting ? 'Creating Your Farm...' : 'Launch Farm Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}