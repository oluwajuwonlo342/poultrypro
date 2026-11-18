import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function DailyRecords() {
  const { activeFarm } = useFarm();
  const [records, setRecords] = useState([]);
  const [batches, setBatches] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    batchId: '',
    recordDate: new Date().toISOString().split('T')[0],
    recordType: 'feeding',
    feedProductId: '',
    feedQuantityKg: 0,
    waterLitres: 0,
    mortalityCount: 0,
    suspectedCause: '',
    description: '',
  });

  const loadData = async () => {
    const query = filterType ? `?recordType=${filterType}` : '';
    const [recRes, batchRes] = await Promise.all([api.get(`/records${query}`), api.get('/batches?status=active')]);
    setRecords(recRes.data);
    setBatches(batchRes.data);
    if (batchRes.data[0] && !form.batchId) {
      setForm((prev) => ({ ...prev, batchId: batchRes.data[0]._id }));
    }
    try {
      const feedRes = await api.get('/feed');
      setFeeds(feedRes.data);
    } catch {
      setFeeds([]);
    }
  };

  useEffect(() => {
    if (activeFarm?._id) loadData();
  }, [activeFarm?._id, filterType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/records', form);
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save record.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Daily Farm Activity Logs</h1>
          <p className="text-sm text-gray-500">Record feeding, water intake, mortality, cleaning, and pen observations.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border bg-white px-3 py-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent font-semibold text-gray-700 focus:outline-none"
            >
              <option value="">All Activities</option>
              <option value="feeding">Feeding</option>
              <option value="water">Water</option>
              <option value="mortality">Mortality</option>
              <option value="cleaning">Cleaning</option>
              <option value="disinfection">Disinfection</option>
              <option value="observation">Observation</option>
            </select>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Log Activity
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-brand-bg text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Activity</th>
              <th className="px-4 py-3">Metric / Details</th>
              <th className="px-4 py-3">Recorded By</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-xs">{new Date(r.recordDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold text-brand-dark">{r.batch?.batchName}</td>
                <td className="px-4 py-3 capitalize">
                  <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                    {r.recordType}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-700">
                  {r.recordType === 'feeding' && `${r.feedQuantityKg} kg (${r.feedType || 'Feed'})`}
                  {r.recordType === 'water' && `${r.waterLitres} Litres`}
                  {r.recordType === 'mortality' && (
                    <span className="font-bold text-red-600">
                      -{r.mortalityCount} birds ({r.suspectedCause || 'Unspecified'})
                    </span>
                  )}
                  {!['feeding', 'water', 'mortality'].includes(r.recordType) && (r.description || 'Completed')}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{r.recordedBy?.fullName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Record Daily Pen Activity</h2>
            {error && <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</div>}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Target Batch *</label>
                <select
                  required
                  value={form.batchId}
                  onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                >
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.batchName} ({b.currentQuantity} birds)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Activity Type *</label>
                <select
                  value={form.recordType}
                  onChange={(e) => setForm({ ...form, recordType: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                >
                  <option value="feeding">Feeding</option>
                  <option value="water">Water Consumption</option>
                  <option value="mortality">Mortality</option>
                  <option value="cleaning">Pen Cleaning</option>
                  <option value="disinfection">Disinfection</option>
                  <option value="observation">General Observation</option>
                </select>
              </div>
            </div>

            {form.recordType === 'feeding' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Select Feed Stock</label>
                  <select
                    value={form.feedProductId}
                    onChange={(e) => setForm({ ...form, feedProductId: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  >
                    <option value="">-- Optional Inventory Link --</option>
                    {feeds.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.productName} ({f.currentStockKg} kg left)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Quantity Fed (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={form.feedQuantityKg}
                    onChange={(e) => setForm({ ...form, feedQuantityKg: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {form.recordType === 'water' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700">Water Consumed (Litres) *</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={form.waterLitres}
                  onChange={(e) => setForm({ ...form, waterLitres: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>
            )}

            {form.recordType === 'mortality' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Dead Birds Count *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.mortalityCount}
                    onChange={(e) => setForm({ ...form, mortalityCount: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Suspected Cause</label>
                  <input
                    placeholder="e.g., Heat stress, Coccidiosis"
                    value={form.suspectedCause}
                    onChange={(e) => setForm({ ...form, suspectedCause: e.target.value })}
                    className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700">Notes / Observations</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}