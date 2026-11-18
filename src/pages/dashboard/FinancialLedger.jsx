import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

const EXPENSE_CATEGORIES = [
  'Bird Purchases',
  'Feed Purchases',
  'Vaccines',
  'Medication',
  'Labour',
  'Electricity',
  'Water',
  'Transportation',
  'Equipment',
  'Repairs',
  'Other',
];

export default function FinancialLedger() {
  const { activeFarm } = useFarm();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Labour',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
  });

  const loadExpenses = async () => {
    const { data } = await api.get('/finance/expenses');
    setExpenses(data);
  };

  useEffect(() => {
    if (activeFarm?._id) loadExpenses();
  }, [activeFarm?._id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/finance/expenses', form);
    setShowModal(false);
    loadExpenses();
  };

  const totalOutflow = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Farm Financial & Expense Ledger</h1>
          <p className="text-sm text-gray-500">
            Cumulative Recorded Expenses: <strong className="text-red-600">₦{totalOutflow.toLocaleString()}</strong>
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Record Expense
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-brand-bg text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Expense Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount (₦)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.map((exp) => (
              <tr key={exp._id}>
                <td className="px-4 py-3 text-xs">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold">{exp.title}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium">{exp.category}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{exp.paymentMethod}</td>
                <td className="px-4 py-3 font-bold text-red-600">₦{exp.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Log Farm Expense</h2>
            <input
              required
              placeholder="Expense Title (e.g., Monthly Pen Attendant Salary)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              required
              min="1"
              placeholder="Amount (₦)"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <input
              type="date"
              required
              value={form.expenseDate}
              onChange={(e) => setForm({ ...form, expenseDate: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">Save Expense</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}