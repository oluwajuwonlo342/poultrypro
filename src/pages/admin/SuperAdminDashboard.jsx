import { useState, useEffect } from 'react';
import { Users, Building, CreditCard, Wallet } from 'lucide-react';
import api from '../../api/axios';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  const loadAdminData = async () => {
    const [overviewRes, usersRes] = await Promise.all([api.get('/admin/overview'), api.get('/admin/users')]);
    setStats(overviewRes.data);
    setUsers(usersRes.data);
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const toggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    await api.patch(`/admin/users/${userId}/status`, { accountStatus: nextStatus });
    loadAdminData();
  };

  if (!stats) return <div className="p-6 text-sm text-gray-500">Loading Super Admin console...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-brand-dark">PoultryPro Super Admin Control Center</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users },
          { label: 'Active Farms', value: stats.totalFarms, icon: Building },
          { label: 'Paid Subscriptions', value: stats.activePaidSubscriptions, icon: CreditCard },
          { label: 'Platform Revenue', value: `₦${stats.totalPlatformRevenueNGN.toLocaleString()}`, icon: Wallet },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-semibold">{card.label}</span>
              <card.icon className="h-5 w-5 text-brand-primary" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-brand-dark">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b px-5 py-4 font-bold text-brand-dark">Registered Farmers & Users</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-bg text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3 font-semibold">{u.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3 capitalize">{u.role.replace('_', ' ')}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      u.accountStatus === 'active' ? 'bg-brand-light text-brand-primary' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {u.accountStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {u.role !== 'super_admin' && (
                    <button
                      onClick={() => toggleStatus(u._id, u.accountStatus)}
                      className="text-xs font-bold text-brand-dark underline hover:text-brand-primary"
                    >
                      {u.accountStatus === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}