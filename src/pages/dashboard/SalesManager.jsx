import { useState, useEffect } from 'react';
import { Plus, Printer } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function SalesManager() {
  const { activeFarm } = useFarm();
  const [sales, setSales] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [receiptSale, setReceiptSale] = useState(null);
  const [form, setForm] = useState({
    productCategory: 'Eggs',
    batchId: '',
    customerName: '',
    customerPhone: '',
    quantity: 10,
    unitLabel: 'crates',
    unitPrice: 4500,
    amountPaid: 45000,
    paymentMethod: 'Cash',
  });

  const loadData = async () => {
    const [salesRes, batchRes] = await Promise.all([api.get('/sales'), api.get('/batches')]);
    setSales(salesRes.data);
    setBatches(batchRes.data);
  };

  useEffect(() => {
    if (activeFarm?._id) loadData();
  }, [activeFarm?._id]);

  const handleCreateSale = async (e) => {
    e.preventDefault();
    const { data } = await api.post('/sales', form);
    setShowModal(false);
    setReceiptSale(data);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Sales & Customer Receipts</h1>
          <p className="text-sm text-gray-500">Record egg crates, live bird sales, and track credit balances.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> New Sale
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-brand-bg text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Receipt #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Total (₦)</th>
              <th className="px-4 py-3">Balance Due</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sales.map((s) => (
              <tr key={s._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs font-bold text-brand-dark">{s.receiptNumber}</td>
                <td className="px-4 py-3 font-medium">{s.customerName}</td>
                <td className="px-4 py-3">
                  {s.quantity} {s.unitLabel} ({s.productCategory})
                </td>
                <td className="px-4 py-3 font-bold">₦{s.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-red-600 font-semibold">₦{s.balanceDue.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                      s.paymentStatus === 'paid'
                        ? 'bg-brand-light text-brand-primary'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setReceiptSale(s)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline"
                  >
                    <Printer className="h-3.5 w-3.5" /> Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleCreateSale} className="w-full max-w-lg space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Record Farm Sale</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.productCategory}
                onChange={(e) =>
                  setForm({
                    ...form,
                    productCategory: e.target.value,
                    unitLabel: e.target.value === 'Eggs' ? 'crates' : 'birds',
                  })
                }
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="Eggs">Eggs</option>
                <option value="Live Birds">Live Birds</option>
                <option value="Manure">Manure</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={form.batchId}
                onChange={(e) => setForm({ ...form, batchId: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="">-- Select Batch (Required for Birds) --</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.batchName} ({b.currentQuantity} birds)
                  </option>
                ))}
              </select>

              <input
                required
                placeholder="Customer Name"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                placeholder="Customer Phone"
                value={form.customerPhone}
                onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="number"
                required
                min="1"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => {
                  const qty = Number(e.target.value);
                  setForm({ ...form, quantity: qty, amountPaid: qty * form.unitPrice });
                }}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="number"
                required
                min="0"
                placeholder="Unit Price (₦)"
                value={form.unitPrice}
                onChange={(e) => {
                  const price = Number(e.target.value);
                  setForm({ ...form, unitPrice: price, amountPaid: form.quantity * price });
                }}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="number"
                required
                min="0"
                placeholder="Amount Paid Now (₦)"
                value={form.amountPaid}
                onChange={(e) => setForm({ ...form, amountPaid: Number(e.target.value) })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="POS">POS</option>
                <option value="Credit">Credit (Pay Later)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600">
                Cancel
              </button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">
                Complete Sale
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="border-b pb-4 text-center">
              <h2 className="text-xl font-extrabold text-brand-dark">{activeFarm?.name}</h2>
              <p className="text-xs text-gray-500">{activeFarm?.address}</p>
              <p className="mt-2 font-mono text-xs font-bold text-brand-primary">
                SALES RECEIPT: {receiptSale.receiptNumber}
              </p>
            </div>
            <div className="my-4 space-y-2 text-xs">
              <div className="flex justify-between"><span>Date:</span><strong>{new Date(receiptSale.salesDate).toLocaleDateString()}</strong></div>
              <div className="flex justify-between"><span>Customer:</span><strong>{receiptSale.customerName}</strong></div>
              <div className="flex justify-between"><span>Item:</span><strong>{receiptSale.quantity} {receiptSale.unitLabel} — {receiptSale.productCategory}</strong></div>
              <div className="flex justify-between"><span>Unit Price:</span><strong>₦{receiptSale.unitPrice.toLocaleString()}</strong></div>
              <div className="flex justify-between border-t pt-2 text-sm"><span>Total Amount:</span><strong>₦{receiptSale.totalAmount.toLocaleString()}</strong></div>
              <div className="flex justify-between text-brand-primary"><span>Amount Paid:</span><strong>₦{receiptSale.amountPaid.toLocaleString()}</strong></div>
              <div className="flex justify-between text-red-600"><span>Balance Due:</span><strong>₦{receiptSale.balanceDue.toLocaleString()}</strong></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 print:hidden">
              <button onClick={() => setReceiptSale(null)} className="rounded-xl px-4 py-2 text-xs font-semibold text-gray-600">
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-bold text-white"
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}