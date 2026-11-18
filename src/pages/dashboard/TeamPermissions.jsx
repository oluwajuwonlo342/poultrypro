import { useState, useEffect } from 'react';
import { UserPlus, Shield } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function TeamPermissions() {
  const { activeFarm } = useFarm();
  const [workers, setWorkers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    jobTitle: 'Pen Attendant',
    permissions: {
      recordFeeding: true,
      recordWater: true,
      recordMortality: true,
      recordEggs: true,
      recordHealth: false,
      viewBatches: true,
      manageInventory: false,
      viewFinancials: false,
      manageSales: false,
    },
  });

  const loadWorkers = async () => {
    const { data } = await api.get(`/farms/${activeFarm._id}/workers`);
    setWorkers(data);
  };

  useEffect(() => {
    if (activeFarm?._id) loadWorkers();
  }, [activeFarm?._id]);

  const handleInvite = async (e) => {
    e.preventDefault();
    await api.post(`/farms/${activeFarm._id}/workers`, form);
    setShowModal(false);
    loadWorkers();
  };

  const togglePerm = (key) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Farm Workers & Role Permissions</h1>
          <p className="text-sm text-gray-500">Control exactly which modules each farm attendant can access.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <UserPlus className="h-4 w-4" /> Add Farm Worker
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {workers.map((w) => (
          <div key={w._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{w.user?.fullName}</h3>
                <p className="text-xs text-gray-500">{w.jobTitle} • {w.user?.email}</p>
              </div>
              <Shield className="h-5 w-5 text-brand-primary" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(w.permissions || {})
                .filter(([, enabled]) => enabled)
                .map(([perm]) => (
                  <span key={perm} className="rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-semibold text-brand-dark">
                    {perm}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleInvite} className="w-full max-w-lg space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Register Farm Worker</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
              <input required placeholder="Job Title (e.g. Pen Supervisor)" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
              <input type="email" required placeholder="Worker Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
              <input required placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
            </div>
            <input type="password" required minLength={6} placeholder="Temporary Login Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" />

            <div className="pt-2">
              <p className="text-xs font-bold text-gray-700">Assigned Module Permissions:</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {Object.keys(form.permissions).map((key) => (
                  <label key={key} className="flex items-center gap-2">
                    <input type="checkbox" checked={form.permissions[key]} onChange={() => togglePerm(key)} />
                    <span>{key}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">Create Worker Account</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}