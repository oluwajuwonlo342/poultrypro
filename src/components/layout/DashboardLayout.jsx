import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Bird,
  ClipboardList,
  Wheat,
  Syringe,
  Egg,
  ShoppingBag,
  Wallet,
  FileBarChart2,
  Users,
  CreditCard,
  Building,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sprout,
  ShieldAlert,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import UpgradePromptModal from '../common/UpgradePromptModal';

export default function DashboardLayout() {
  const { user, farms, logout } = useAuth();
  const { activeFarm, switchFarm, hasPermission } = useFarm();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileRoute = user?.role === 'super_admin' ? '/admin/profile' : '/dashboard/profile';

  // Build role-based navigation links
  const navItems =
    user?.role === 'super_admin'
      ? [
          { to: '/admin', label: 'Platform Overview', icon: LayoutDashboard, end: true },
          { to: '/admin/users', label: 'Farmers & Users', icon: Users },
          { to: '/admin/farms', label: 'Registered Farms', icon: Building },
          { to: '/admin/plans', label: 'Subscription Plans', icon: CreditCard },
          { to: '/admin/transactions', label: 'Paystack Payments', icon: Wallet },
          { to: '/admin/tickets', label: 'Support Tickets', icon: ShieldAlert },
          { to: '/admin/profile', label: 'Profile Settings', icon: UserCircle },
        ]
      : [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true, show: true },
          { to: '/dashboard/batches', label: 'Bird Batches', icon: Bird, show: hasPermission('viewBatches') },
          { to: '/dashboard/records', label: 'Daily Records', icon: ClipboardList, show: true },
          { to: '/dashboard/feed', label: 'Feed & Inventory', icon: Wheat, show: hasPermission('manageInventory') },
          { to: '/dashboard/health', label: 'Vaccination & Health', icon: Syringe, show: true },
          { to: '/dashboard/eggs', label: 'Egg Production', icon: Egg, show: hasPermission('recordEggs') },
          { to: '/dashboard/sales', label: 'Sales & Receipts', icon: ShoppingBag, show: hasPermission('manageSales') },
          { to: '/dashboard/finance', label: 'Financial Ledger', icon: Wallet, show: hasPermission('viewFinancials') },
          { to: '/dashboard/reports', label: 'Analytics & Reports', icon: FileBarChart2, show: user?.role === 'farm_owner' },
          { to: '/dashboard/farms', label: 'My Farms', icon: Building, show: user?.role === 'farm_owner' },
          { to: '/dashboard/team', label: 'Workers & Roles', icon: Users, show: user?.role === 'farm_owner' },
          { to: '/dashboard/billing', label: 'Subscription', icon: CreditCard, show: user?.role === 'farm_owner' },
          { to: '/dashboard/profile', label: 'Profile Settings', icon: UserCircle, show: true },
        ].filter((item) => item.show);

  const SidebarLinks = ({ onNavigate }) => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-brand-primary text-white shadow-sm'
                : 'text-gray-600 hover:bg-brand-light hover:text-brand-dark'
            }`
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden flex-col border-r border-gray-200 bg-white transition-all duration-200 lg:flex ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
          <Link to={user?.role === 'super_admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary text-white">
              <Sprout className="h-5 w-5" />
            </div>
            {!collapsed && <span className="text-lg font-extrabold text-brand-dark">PoultryPro</span>}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <SidebarLinks />

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative flex w-72 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <span className="text-lg font-extrabold text-brand-dark">PoultryPro</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarLinks onNavigate={() => setMobileOpen(false)} />
            <div className="border-t p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600"
              >
                <LogOut className="h-5 w-5" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Active Farm Selector */}
            {user?.role !== 'super_admin' && farms.length > 0 && (
              <select
                value={activeFarm?._id || ''}
                onChange={(e) => switchFarm(e.target.value)}
                className="max-w-[210px] rounded-xl border border-gray-200 bg-brand-light/60 px-3 py-1.5 text-sm font-semibold text-brand-dark focus:border-brand-primary focus:outline-none sm:max-w-xs"
              >
                {farms.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} ({f.farmType})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user?.role !== 'super_admin' && (
              <Link
                to="/dashboard/notifications"
                className="relative rounded-xl p-2 text-gray-600 hover:bg-brand-light hover:text-brand-primary"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-primary" />
              </Link>
            )}

            <Link
              to={profileRoute}
              className="flex items-center gap-2.5 rounded-xl border-l border-gray-200 py-1 pl-3 transition hover:opacity-80"
              title="Profile Settings"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold text-gray-800">{user?.fullName}</p>
                <p className="text-[11px] capitalize text-gray-500">{user?.role?.replace('_', ' ')}</p>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Global Subscription Plan Limit / Upgrade Prompt Modal */}
      <UpgradePromptModal />
    </div>
  );
}