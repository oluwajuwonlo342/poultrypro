import { useState, useEffect } from 'react';
import { Plus, PackagePlus, AlertTriangle } from 'lucide-react';
import api from '../../api/axios';
import { useFarm } from '../../context/FarmContext';

export default function FeedInventory() {
  const { activeFarm } = useFarm();
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newModal, setNewModal] = useState(false);
  const [restockModal, setRestockModal] = useState(null);
  const [productForm, setProductForm] = useState({
    productName: '',
    feedType: 'Starter',
    manufacturer: '',
    initialStockKg: 500,
    lowStockThresholdKg: 100,
    purchasePriceTotal: 0,
    supplier: '',
  });
  const [restockForm, setRestockForm] = useState({ quantityKg: 250, totalCost: 0, supplier: '' });

  const loadFeed = async () => {
    const [prodRes, txRes] = await Promise.all([api.get('/feed'), api.get('/feed/transactions')]);
    setProducts(prodRes.data);
    setTransactions(txRes.data);
  };

  useEffect(() => {
    if (activeFarm?._id) loadFeed();
  }, [activeFarm?._id]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    await api.post('/feed', productForm);
    setNewModal(false);
    loadFeed();
  };

  const handleRestock = async (e) => {
    e.preventDefault();
    await api.post('/feed/purchase', { ...restockForm, feedProductId: restockModal._id });
    setRestockModal(null);
    loadFeed();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark">Feed & Inventory Control</h1>
          <p className="text-sm text-gray-500">Monitor available feed bags/kg, unit costs, and restock history.</p>
        </div>
        <button
          onClick={() => setNewModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Add Feed Product
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const isLow = p.currentStockKg <= p.lowStockThresholdKg;
          return (
            <div key={p._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-bold text-brand-dark">
                    {p.feedType}
                  </span>
                  <h3 className="mt-2 text-lg font-extrabold text-gray-900">{p.productName}</h3>
                  <p className="text-xs text-gray-500">{p.manufacturer || 'Standard Mill'}</p>
                </div>
                {isLow && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              </div>

              <div className="mt-4 flex items-baseline justify-between rounded-xl bg-brand-bg p-3">
                <div>
                  <p className="text-[11px] text-gray-500">Available Stock</p>
                  <p className={`text-xl font-extrabold ${isLow ? 'text-red-600' : 'text-brand-dark'}`}>
                    {p.currentStockKg.toLocaleString()} kg
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-500">Avg Cost/kg</p>
                  <p className="text-sm font-bold text-gray-800">₦{p.weightedAvgCostPerKg.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setRestockModal(p);
                  setRestockForm({ quantityKg: 250, totalCost: 0, supplier: p.supplier || '' });
                }}
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-light py-2 text-xs font-bold text-brand-dark hover:bg-brand-primary hover:text-white"
              >
                <PackagePlus className="h-4 w-4" /> Record Feed Purchase
              </button>
            </div>
          );
        })}
      </div>

      {/* Inventory Movement Ledger */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b px-5 py-3.5 text-sm font-bold text-brand-dark">Recent Stock Movements</div>
        <table className="w-full text-left text-xs">
          <thead className="bg-brand-bg uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Feed Product</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Quantity (kg)</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {transactions.slice(0, 15).map((tx) => (
              <tr key={tx._id}>
                <td className="px-4 py-3">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold">{tx.feedProduct?.productName}</td>
                <td className="px-4 py-3 capitalize">{tx.transactionType}</td>
                <td className={`px-4 py-3 font-bold ${tx.quantityKg >= 0 ? 'text-brand-primary' : 'text-red-600'}`}>
                  {tx.quantityKg > 0 ? `+${tx.quantityKg}` : tx.quantityKg} kg
                </td>
                <td className="px-4 py-3 text-gray-500">{tx.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Feed Modal */}
      {newModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleAddProduct} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Add Feed Product</h2>
            <input
              required
              placeholder="Product Name (e.g. Ultima Broiler Starter)"
              value={productForm.productName}
              onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <select
              value={productForm.feedType}
              onChange={(e) => setProductForm({ ...productForm, feedType: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            >
              {['Pre-Starter', 'Starter', 'Grower', 'Finisher', 'Chick Mash', 'Grower Mash', 'Layer Mash', 'Concentrate'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                min="0"
                placeholder="Opening Stock (kg)"
                value={productForm.initialStockKg}
                onChange={(e) => setProductForm({ ...productForm, initialStockKg: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
              <input
                type="number"
                min="0"
                placeholder="Purchase Cost (₦)"
                value={productForm.purchasePriceTotal}
                onChange={(e) => setProductForm({ ...productForm, purchasePriceTotal: e.target.value })}
                className="rounded-xl border px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setNewModal(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">Save Feed</button>
            </div>
          </form>
        </div>
      )}

      {/* Restock Modal */}
      {restockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleRestock} className="w-full max-w-md space-y-3 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-extrabold text-brand-dark">Restock {restockModal.productName}</h2>
            <input
              type="number"
              required
              min="1"
              placeholder="Quantity Purchased (kg)"
              value={restockForm.quantityKg}
              onChange={(e) => setRestockForm({ ...restockForm, quantityKg: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <input
              type="number"
              required
              min="0"
              placeholder="Total Purchase Cost (₦)"
              value={restockForm.totalCost}
              onChange={(e) => setRestockForm({ ...restockForm, totalCost: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <input
              placeholder="Supplier Name"
              value={restockForm.supplier}
              onChange={(e) => setRestockForm({ ...restockForm, supplier: e.target.value })}
              className="w-full rounded-xl border px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setRestockModal(null)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              <button type="submit" className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white">Record Purchase</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}