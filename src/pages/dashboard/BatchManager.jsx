import { useState, useEffect } from 'react';
import { Plus, Scale, Bird } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function BatchManager() {
  const { activeFarm } = useFarm();
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [weightModalBatch, setWeightModalBatch] = useState(null);
  const [form, setForm] = useState({
    batchName: '',
    category: 'Broilers',
    breed: 'Ross 308',
    initialQuantity: 500,
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: 0,
    supplier: '',
    housingLocation: 'Pen House 1',
  });
  const [weightForm, setWeightForm] = useState({ birdsSampled: 20, averageWeightKg: 1.2 });

  const fetchBatches = async () => {
    const { data } = await api.get('/batches');
    setBatches(data);
  };

  useEffect(() => {
    if (activeFarm?._id) fetchBatches();
  }, [activeFarm?._id]);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    await api.post('/batches', form);
    setShowModal(false);
    fetchBatches();
  };

  const handleRecordWeight = async (e) => {
    e.preventDefault();
    await api.post(`/batches/${weightModalBatch._id}/weights`, weightForm);
    setWeightModalBatch(null);
    fetchBatches();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Bird & Batch Management</h1>
          <p className="text-sm text-gray-500">Track flock populations, FCR, mortality, and net profit per batch.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Stock New Batch
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {batches.map((b) => (
          <div key={b._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                  {b.category} • {b.batchCode}
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-gray-900">{b.batchName}</h3>
                <p className="text-xs text-gray-500">{b.breed} • {b.housingLocation}</p>
              </div>
              <Bird className="h-6 w-6 text-brand-primary" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-brand-bg p-3 text-center">
              <div>
                <p className="text-[11px] text-gray-500">Live Birds</p>
                <p className="text-sm font-extrabold text-brand-dark">{b.currentQuantity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">Mortality</p>
                <p className="text-sm font-extrabold text-red-600">
                  {b.totalMortality} ({b.metrics?.mortalityRate}%)
                </p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500">{b.category === 'Layers' ? 'Avg Wt' : 'FCR'}</p>
                <p className="text-sm font-extrabold text-brand-primary">
                  {b.category === 'Layers' ? `${b.latestAvgWeightKg} kg` : b.metrics?.fcr || '0.00'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
              <div>
                <span className="text-gray-500">Net Profit: </span>
                <strong className={b.metrics?.netProfit >= 0 ? 'text-brand-primary' : 'text-red-600'}>
                  ₦{b.metrics?.netProfit?.toLocaleString()}
                </strong>
              </div>
              <button
                onClick={() => setWeightModalBatch(b)}
                className="inline-flex items-center gap-1 rounded-lg bg-brand-light px-2.5 py-1.5 font-semibold text-brand-dark hover:bg-brand-primary hover:text-white"
              >
                <Scale className="h-3.5 w-3.5" /> Weigh Sample
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreateBatch} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Register New Bird Batch</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Batch Name (e.g. Broiler Cycle 5)"
                value={form.batchName}
                onChange={(e) => setForm({ ...form, batchName: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="Broilers">Broilers</option>
                <option value="Layers">Layers</option>
                <option value="Cockerels">Cockerels</option>
                <option value="Turkeys">Turkeys</option>
                <option value="Others">Others</option>
              </select>
              <input
                placeholder="Breed (e.g. Ross 308 / Isa Brown)"
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="number"
                required
                min="1"
                placeholder="Initial Quantity"
                value={form.initialQuantity}
                onChange={(e) => setForm({ ...form, initialQuantity: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="date"
                required
                value={form.purchaseDate}
                onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="number"
                min="0"
                placeholder="Total Purchase Cost (₦)"
                value={form.purchaseCost}
                onChange={(e) => setForm({ ...form, purchaseCost: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-xl px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">
                Save Batch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weight Sampling Modal */}
      {weightModalBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleRecordWeight} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Record Weight Sample — {weightModalBatch.batchName}</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Number of Birds Sampled</label>
              <input
                type="number"
                required
                min="1"
                value={weightForm.birdsSampled}
                onChange={(e) => setWeightForm({ ...weightForm, birdsSampled: e.target.value })}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700">Average Bird Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                value={weightForm.averageWeightKg}
                onChange={(e) => setWeightForm({ ...weightForm, averageWeightKg: e.target.value })}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setWeightModalBatch(null)} className="px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">
                Update Weight & FCR
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}