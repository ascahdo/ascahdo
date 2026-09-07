import React, { useState } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const PasswordChangeModal: React.FC = () => {
  const { isBn } = useTranslation();
  const { user, showPasswordChangeModal, setShowPasswordChangeModal, updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showPasswordChangeModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError(isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(isBn ? 'নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মেলেনি।' : 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await updatePassword({ currentPassword, newPassword });
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {isBn ? 'পাসওয়ার্ড পরিবর্তন ও নিরাপত্তা' : 'Change Password & Security'}
              </h3>
              <p className="text-xs text-slate-300">
                {isBn ? 'আপনার অ্যাকাউন্টের নিরাপত্তা হালনাগাদ করুন' : 'Update your account access password'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordChangeModal(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed bg-amber-50 p-3 rounded-xl border border-amber-200">
            {isBn
              ? 'নিরাপত্তা সুরক্ষার স্বার্থে প্রাথমিক ডিফল্ট পাসওয়ার্ড পরিবর্তন করে আপনার নিজস্ব শক্তিশালী নতুন পাসওয়ার্ড সেট করুন।'
              : 'For system integrity, please replace the initial development password with your personalized secure master key.'}
          </p>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isBn ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                title={showCurrent ? (isBn ? 'পাসওয়ার্ড লুকান' : 'Hide Password') : (isBn ? 'পাসওয়ার্ড দেখুন' : 'Show Password')}
                aria-label="Toggle current password visibility"
              >
                {showCurrent ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isBn ? 'নতুন শক্তিশালী পাসওয়ার্ড' : 'New Strong Password'}
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                title={showNew ? (isBn ? 'পাসওয়ার্ড লুকান' : 'Hide Password') : (isBn ? 'পাসওয়ার্ড দেখুন' : 'Show Password')}
                aria-label="Toggle new password visibility"
              >
                {showNew ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isBn ? 'নতুন পাসওয়ার্ড পুনরায় লিখুন' : 'Confirm New Password'}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3 pr-10 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
                title={showConfirm ? (isBn ? 'পাসওয়ার্ড লুকান' : 'Hide Password') : (isBn ? 'পাসওয়ার্ড দেখুন' : 'Show Password')}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow transition disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4" />
            <span>{loading ? (isBn ? 'আপডেট হচ্ছে...' : 'Updating...') : (isBn ? 'পাসওয়ার্ড হালনাগাদ ও প্রবেশ' : 'Update & Continue')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
