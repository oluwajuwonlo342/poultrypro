import { useState, useEffect } from 'react';
import { Egg, Plus } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function EggProduction() {
  const { activeFarm } = useFarm();
  const [eggData, setEggData] = useState({ eggStockAvailable: 0, cratesAvailable: 0, records: [] });
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    batchId: '',
    productionDate: new Date().toISOString().split('T')[0],
    totalCollected: 300,
    goodEggs: 295,
    crackedEggs: 3,
    brokenEggs: 2,
    rejectedEggs: 0,
  });

  const loadEggs = async () => {
    const [eRes, bRes] = await Promise.all([api.get('/eggs'), api.get('/batches?status=active')]);
    setEggData(eRes.data);
    setBatches(bRes.data);
    if (bRes.data[0] && !form.batchId) {
      setForm((p) => ({ ...p, batchId: bRes.data[0]._id }));
    }
  };

  useEffect(() => {
    if (activeFarm?._id) loadEggs();
  }, [activeFarm?._id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/eggs', form);
      setShowModal(false);
      loadEggs();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving egg collection.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Layer & Egg Production</h1>
          <p className="text-sm text-gray-500">Track daily egg collections, Hen-Day %, and saleable crate inventory.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Record Egg Collection
        </button>
      </div>

      {/* Inventory Banner */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Saleable Egg Stock (Crates of 30)</span>
            <Egg className="h-5 w-5 text-brand-primary" />
          </div>
          <p className="mt-2 text-3xl font-extrabold text-brand-dark">{eggData.cratesAvailable.toLocaleString()} Crates</p>
          <p className="text-xs text-gray-500">{eggData.eggStockAvailable.toLocaleString()} individual good eggs</p>
        </div>
      </div>

      {/* Collection Logs Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-brand-bg text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Layer Batch</th>
              <th className="px-4 py-3">Collected</th>
              <th className="px-4 py-3">Good Eggs</th>
              <th className="px-4 py-3">Cracked / Broken</th>
              <th className="px-4 py-3">Hen-Day %</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {eggData.records.map((r) => (
              <tr key={r._id}>
                <td className="px-4 py-3 text-xs">{new Date(r.productionDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold">{r.batch?.batchName}</td>
                <td className="px-4 py-3 font-bold">{r.totalCollected}</td>
                <td className="px-4 py-3 text-brand-primary font-bold">{r.goodEggs}</td>
                <td className="px-4 py-3 text-red-600">{r.crackedEggs + r.brokenEggs}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                    {r.henDayPercentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSave} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Record Daily Egg Collection</h2>
            {error && <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</div>}
            <select
              required
              value={form.batchId}
              onChange={(e) => setForm({ ...form, batchId: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b.batchName} ({b.currentQuantity} hens)</option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-gray-600">Total Collected</label>
                <input type="number" required min="1" value={form.totalCollected} onChange={(e) => setForm({ ...form, totalCollected: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Good Saleable Eggs</label>
                <input type="number" required min="0" value={form.goodEggs} onChange={(e) => setForm({ ...form, goodEggs: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Cracked Eggs</label>
                <input type="number" min="0" value={form.crackedEggs} onChange={(e) => setForm({ ...form, crackedEggs: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Broken Eggs</label>
                <input type="number" min="0" value={form.brokenEggs} onChange={(e) => setForm({ ...form, brokenEggs: e.target.value })} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">Save Collection</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}