import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmProvider } from './context/FarmContext';

import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import ResetPassword from './pages/public/ResetPassword';
import FarmSetupWizard from './pages/onboarding/FarmSetupWizard';
import DashboardLayout from './components/layout/DashboardLayout';

import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import FarmManager from './pages/dashboard/FarmManager';
import BatchManager from './pages/dashboard/BatchManager';
import DailyRecords from './pages/dashboard/DailyRecords';
import FeedInventory from './pages/dashboard/FeedInventory';
import HealthCalendar from './pages/dashboard/HealthCalendar';
import EggProduction from './pages/dashboard/EggProduction';
import SalesManager from './pages/dashboard/SalesManager';
import FinancialLedger from './pages/dashboard/FinancialLedger';
import AnalyticsReports from './pages/dashboard/AnalyticsReports';
import TeamPermissions from './pages/dashboard/TeamPermissions';
import BillingSubscription from './pages/dashboard/BillingSubscription';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, requiresOnboarding } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-semibold text-brand-primary">
        Loading PoultryPro...
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  if (requiresOnboarding && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <FarmProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Marketing & Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* First-Time Farm Onboarding */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute allowedRoles={['farm_owner']}>
                  <FarmSetupWizard />
                </ProtectedRoute>
              }
            />

            {/* Farm Owner & Authorized Worker Workspace */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['farm_owner', 'farm_worker']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<OwnerDashboard />} />
              <Route path="farms" element={<FarmManager />} />
              <Route path="batches" element={<BatchManager />} />
              <Route path="records" element={<DailyRecords />} />
              <Route path="feed" element={<FeedInventory />} />
              <Route path="health" element={<HealthCalendar />} />
              <Route path="eggs" element={<EggProduction />} />
              <Route path="sales" element={<SalesManager />} />
              <Route path="finance" element={<FinancialLedger />} />
              <Route path="reports" element={<AnalyticsReports />} />
              <Route path="team" element={<TeamPermissions />} />
              <Route path="billing" element={<BillingSubscription />} />
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            {/* Super Admin SaaS Control Center */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<SuperAdminDashboard />} />
              <Route path="*" element={<SuperAdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FarmProvider>
    </AuthProvider>
  );
}