import { useState } from 'react';
import { User, Phone, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSettings() {
  const { user, setUser, subscription } = useAuth();

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const { data } = await api.put('/auth/profile', profileForm);
      if (setUser) setUser(data.user);
      setProfileMsg({ type: 'success', text: data.message });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
    }

    setSavingPassword(true);
    try {
      const { data } = await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ type: 'success', text: data.message });
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.message || 'Unable to change password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-dark">Account & Profile Settings</h1>
        <p className="text-sm text-gray-500">Manage your personal details, contact phone, and account security.</p>
      </div>

      {/* Account Overview Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-xl font-extrabold text-white">
            {user?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">{user?.fullName}</h2>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-bold capitalize text-brand-dark">
                {user?.role?.replace('_', ' ')}
              </span>
              {user?.role === 'farm_owner' && (
                <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                  Plan: {subscription?.planCode || 'FREE'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-primary">
          <ShieldCheck className="h-4 w-4" /> Account Active
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Details Form */}
        <form onSubmit={handleProfileUpdate} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-brand-dark">Personal Information</h3>

          {profileMsg.text && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
                profileMsg.type === 'success' ? 'bg-brand-light text-brand-dark' : 'bg-red-50 text-red-700'
              }`}
            >
              {profileMsg.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Email Address (Read-Only)</label>
            <div className="relative mt-1">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-3 pl-9 text-sm text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Phone Number</label>
            <div className="relative mt-1">
              <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                placeholder="+234 800 000 0000"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="w-full rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white hover:bg-brand-dark disabled:opacity-60"
          >
            {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordUpdate} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-extrabold text-brand-dark">Security & Password</h3>

          {passwordMsg.text && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium ${
                passwordMsg.type === 'success' ? 'bg-brand-light text-brand-dark' : 'bg-red-50 text-red-700'
              }`}
            >
              {passwordMsg.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700">Current Password</label>
            <div className="relative mt-1">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">New Password</label>
            <div className="relative mt-1">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Minimum 6 characters"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Confirm New Password</label>
            <div className="relative mt-1">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full rounded-xl border border-gray-300 py-2.5 pr-3 pl-9 text-sm focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="w-full rounded-xl bg-brand-dark py-2.5 text-sm font-bold text-white hover:bg-brand-primary disabled:opacity-60"
          >
            {savingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}