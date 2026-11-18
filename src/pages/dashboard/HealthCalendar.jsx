import { useState, useEffect } from 'react';
import { Syringe, Pill, CheckCircle2, Plus } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function HealthCalendar() {
  const { activeFarm } = useFarm();
  const [vaccinations, setVaccinations] = useState([]);
  const [medications, setMedications] = useState([]);
  const [batches, setBatches] = useState([]);
  const [vacModal, setVacModal] = useState(false);
  const [medModal, setMedModal] = useState(false);

  const [vacForm, setVacForm] = useState({
    batchId: '',
    vaccineName: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    dosage: '',
    administrationMethod: 'Drinking Water',
    nextScheduledDate: '',
  });

  const [medForm, setMedForm] = useState({
    batchId: '',
    medicationName: '',
    reason: '',
    dosage: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const loadHealth = async () => {
    const [vRes, mRes, bRes] = await Promise.all([
      api.get('/health/vaccinations'),
      api.get('/health/medications'),
      api.get('/batches?status=active'),
    ]);
    setVaccinations(vRes.data);
    setMedications(mRes.data);
    setBatches(bRes.data);
    if (bRes.data[0]) {
      setVacForm((p) => ({ ...p, batchId: p.batchId || bRes.data[0]._id }));
      setMedForm((p) => ({ ...p, batchId: p.batchId || bRes.data[0]._id }));
    }
  };

  useEffect(() => {
    if (activeFarm?._id) loadHealth();
  }, [activeFarm?._id]);

  const handleAddVac = async (e) => {
    e.preventDefault();
    await api.post('/health/vaccinations', vacForm);
    setVacModal(false);
    loadHealth();
  };

  const handleAdminister = async (id) => {
    await api.patch(`/health/vaccinations/${id}/administer`, { administrationDate: new Date() });
    loadHealth();
  };

  const handleAddMed = async (e) => {
    e.preventDefault();
    await api.post('/health/medications', medForm);
    setMedModal(false);
    loadHealth();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Vaccination & Health Management</h1>
          <p className="text-sm text-gray-500">Log veterinarian-prescribed vaccination schedules and medication courses.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVacModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Schedule Vaccine
          </button>
          <button
            onClick={() => setMedModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-dark px-4 py-2.5 text-xs font-bold text-white hover:bg-brand-primary"
          >
            <Plus className="h-4 w-4" /> Log Medication
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vaccinations Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-bold text-brand-dark">
            <Syringe className="h-5 w-5 text-brand-primary" /> Vaccination Calendar
          </h2>
          <div className="mt-4 space-y-3">
            {vaccinations.map((v) => (
              <div key={v._id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-brand-bg/60 p-3.5">
                <div>
                  <p className="font-bold text-gray-900">{v.vaccineName}</p>
                  <p className="text-xs text-gray-600">
                    {v.batch?.batchName} • Scheduled: {new Date(v.scheduledDate).toLocaleDateString()} ({v.administrationMethod})
                  </p>
                </div>
                {v.status === 'completed' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-1 text-xs font-bold text-brand-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Done
                  </span>
                ) : (
                  <button
                    onClick={() => handleAdminister(v._id)}
                    className="rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
                  >
                    Mark Administered
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Medications Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-base font-bold text-brand-dark">
            <Pill className="h-5 w-5 text-blue-600" /> Medication Courses
          </h2>
          <div className="mt-4 space-y-3">
            {medications.map((m) => (
              <div key={m._id} className="rounded-xl border border-gray-100 bg-brand-bg/60 p-3.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">{m.medicationName}</p>
                  <span className="text-xs font-semibold text-blue-700">{m.dosage}</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  {m.batch?.batchName} • Reason: {m.reason}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {new Date(m.startDate).toLocaleDateString()} — {new Date(m.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Vaccine Modal */}
      {vacModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAddVac} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Schedule Vaccination</h2>
            <select
              required
              value={vacForm.batchId}
              onChange={(e) => setVacForm({ ...vacForm, batchId: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b.batchName}</option>
              ))}
            </select>
            <input
              required
              placeholder="Vaccine Name (e.g., Lasota, Gumboro IBD)"
              value={vacForm.vaccineName}
              onChange={(e) => setVacForm({ ...vacForm, vaccineName: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-gray-600">Scheduled Date</label>
                <input
                  type="date"
                  required
                  value={vacForm.scheduledDate}
                  onChange={(e) => setVacForm({ ...vacForm, scheduledDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Booster Date (Optional)</label>
                <input
                  type="date"
                  value={vacForm.nextScheduledDate}
                  onChange={(e) => setVacForm({ ...vacForm, nextScheduledDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
                />
              </div>
            </div>
            <input
              placeholder="Dosage & Method (e.g., 1 vial in 20L water)"
              value={vacForm.dosage}
              onChange={(e) => setVacForm({ ...vacForm, dosage: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setVacModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">Save Schedule</button>
            </div>
          </form>
        </div>
      )}

      {/* Medication Modal */}
      {medModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAddMed} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Record Medication Course</h2>
            <select
              required
              value={medForm.batchId}
              onChange={(e) => setMedForm({ ...medForm, batchId: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>{b.batchName}</option>
              ))}
            </select>
            <input
              required
              placeholder="Medication Name"
              value={medForm.medicationName}
              onChange={(e) => setMedForm({ ...medForm, medicationName: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Reason / Vet Indication"
              value={medForm.reason}
              onChange={(e) => setMedForm({ ...medForm, reason: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Dosage (e.g., 1g per 2 Litres)"
              value={medForm.dosage}
              onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="date" required value={medForm.startDate} onChange={(e) => setMedForm({ ...medForm, startDate: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
              <input type="date" required value={medForm.endDate} onChange={(e) => setMedForm({ ...medForm, endDate: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setMedModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">Save Medication</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}