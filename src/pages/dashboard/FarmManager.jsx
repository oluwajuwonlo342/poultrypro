import { useState } from 'react';
import { Building2, Plus, CheckCircle2, MapPin, Edit3, Archive } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';

export default function FarmManager() {
  const { farms, setFarms } = useAuth();
  const { activeFarm, switchFarm } = useFarm();
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    address: '',
    farmType: 'Broiler',
    farmSize: '',
    poultryHousesCount: 1,
    contactPhone: '',
  });

  const openCreateModal = () => {
    setEditingFarm(null);
    setForm({
      name: '',
      location: '',
      address: '',
      farmType: 'Broiler',
      farmSize: '',
      poultryHousesCount: 1,
      contactPhone: '',
    });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (farm) => {
    setEditingFarm(farm);
    setForm({
      name: farm.name || '',
      location: farm.location || '',
      address: farm.address || '',
      farmType: farm.farmType || 'Broiler',
      farmSize: farm.farmSize || '',
      poultryHousesCount: farm.poultryHousesCount || 1,
      contactPhone: farm.contactPhone || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingFarm) {
        const { data } = await api.put(`/farms/${editingFarm._id}`, form);
        setFarms(farms.map((f) => (f._id === data._id ? data : f)));
      } else {
        const { data } = await api.post('/farms', form);
        setFarms([...farms, data]);
        switchFarm(data._id);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save farm details.');
    }
  };

  const handleArchive = async (farmId) => {
    if (farms.length <= 1) {
      return alert('You must keep at least one active farm.');
    }
    if (!window.confirm('Archive this farm? Its records will be hidden from active operations.')) return;
    await api.put(`/farms/${farmId}`, { isArchived: true });
    const remaining = farms.filter((f) => f._id !== farmId);
    setFarms(remaining);
    if (activeFarm?._id === farmId && remaining[0]) {
      switchFarm(remaining[0]._id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">My Poultry Farms</h1>
          <p className="text-sm text-gray-500">Manage multiple farm locations and switch between isolated farm workspaces.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add New Farm
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm) => {
          const isCurrent = activeFarm?._id === farm._id;
          return (
            <div
              key={farm._id}
              className={`flex flex-col justify-between rounded-2xl bg-white p-5 shadow-sm transition ${
                isCurrent ? 'ring-2 ring-brand-primary' : 'border border-gray-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                    {farm.farmType}
                  </span>
                  {isCurrent && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-primary">
                      <CheckCircle2 className="h-4 w-4" /> Active
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-lg font-extrabold text-gray-900">{farm.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5 text-brand-primary" /> {farm.location}
                </p>
                <p className="mt-1 text-xs text-gray-500">{farm.address}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-brand-bg p-3 text-xs">
                  <div>
                    <span className="text-gray-500">Houses/Pens: </span>
                    <strong className="text-brand-dark">{farm.poultryHousesCount}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Capacity: </span>
                    <strong className="text-brand-dark">{farm.farmSize || 'Standard'}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                {!isCurrent ? (
                  <button
                    onClick={() => switchFarm(farm._id)}
                    className="rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
                  >
                    Switch to Farm
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-gray-400">Currently Selected</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(farm)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-dark"
                    title="Edit Farm"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleArchive(farm._id)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    title="Archive Farm"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSave} className="w-full max-w-lg space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-2 text-brand-dark">
              <Building2 className="h-5 w-5 text-brand-primary" />
              <h2 className="text-lg font-extrabold">{editingFarm ? 'Edit Farm Profile' : 'Register New Farm'}</h2>
            </div>

            {error && <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</div>}

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Farm Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <select
                value={form.farmType}
                onChange={(e) => setForm({ ...form, farmType: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="Broiler">Broiler</option>
                <option value="Layer">Layer</option>
                <option value="Cockerel">Cockerel</option>
                <option value="Turkey">Turkey</option>
                <option value="Mixed Poultry">Mixed Poultry</option>
              </select>
              <input
                required
                placeholder="Location (City / State)"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="number"
                min="1"
                required
                placeholder="Poultry Houses Count"
                value={form.poultryHousesCount}
                onChange={(e) => setForm({ ...form, poultryHousesCount: Number(e.target.value) })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>

            <input
              required
              placeholder="Full Street Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder="Farm Size / Bird Capacity"
                value={form.farmSize}
                onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                placeholder="Farm Contact Phone"
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">
                {editingFarm ? 'Save Changes' : 'Create Farm'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}