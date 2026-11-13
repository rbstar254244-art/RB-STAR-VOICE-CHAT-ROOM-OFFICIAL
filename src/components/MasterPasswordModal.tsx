import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Unlock, Key, CheckCircle2, AlertCircle, ShieldCheck, X } from 'lucide-react';
import { getLockoutStatus } from '../utils/security';

interface MasterPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'unlock' | 'change';
}

export const MasterPasswordModal: React.FC<MasterPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'unlock'
}) => {
  const { 
    isUnlocked, 
    unlockPortal, 
    lockPortal, 
    changeMasterPassword
  } = useApp();

  const [mode, setMode] = useState<'unlock' | 'change'>('unlock');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When not unlocked, FORCE mode to 'unlock' so no outsider can ever access change password
  useEffect(() => {
    if (!isUnlocked) {
      setMode('unlock');
    } else {
      setMode(defaultMode);
    }
    setError('');
    setSuccess('');
    setEnteredPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsSubmitting(false);
  }, [isOpen, isUnlocked, defaultMode]);

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    const lockout = getLockoutStatus();
    if (lockout.isLocked) {
      setError(`Security Lockdown Active: Too many failed attempts. Access restricted for ${lockout.remainingSeconds}s to protect portal.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await unlockPortal(enteredPassword);
      if (ok) {
        setSuccess('Success! Administrator portal unlocked.');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 700);
      } else {
        const updated = getLockoutStatus();
        if (updated.isLocked) {
          setError(`Security Alert: 5 failed attempts detected. System temporarily locked for ${updated.remainingSeconds}s to block unauthorized intrusion.`);
        } else {
          const remaining = Math.max(1, 5 - updated.attempts);
          setError(`Incorrect password! Default is "admin" or your saved password. (${remaining} attempts left before security lockout)`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');
    setSuccess('');

    // Extra security check: only allow changing if already unlocked
    if (!isUnlocked) {
      setError('Unauthorized. Please log in first to change the master password.');
      return;
    }

    if (newPassword.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);
    try {
      const changed = await changeMasterPassword(newPassword);
      if (changed) {
        setSuccess('Success! Your custom administrator password has been updated and securely saved.');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setSuccess('');
          onClose();
        }, 1200);
      } else {
        setError('Unable to update password on server. Please ensure you are logged in.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative">
        {/* Header decoration */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500" />
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3.5 mb-5">
            <img 
              src="./assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg" 
              alt="RB STAR" 
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/80 shadow-lg shadow-purple-950 shrink-0" 
            />
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isUnlocked ? 'RB STAR Administrator Security' : 'RB STAR Administrator Login'}</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                  {isUnlocked ? 'UNLOCKED' : 'PROTECTED'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isUnlocked 
                  ? 'Manage administrator password & security settings' 
                  : 'Enter master password to access portal controls'}
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs - ONLY VISIBLE INSIDE WHEN LOGGED IN */}
          {isUnlocked && (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/70 border border-slate-800 rounded-xl mb-5">
              <button
                onClick={() => { setMode('unlock'); setError(''); setSuccess(''); }}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'unlock' 
                    ? 'bg-purple-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Portal Status</span>
              </button>
              <button
                onClick={() => { setMode('change'); setError(''); setSuccess(''); }}
                className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'change' 
                    ? 'bg-amber-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Unlock / Login Mode Form (The ONLY mode accessible from outside) */}
          {mode === 'unlock' && (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Administrator Password:
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={enteredPassword}
                    onChange={(e) => setEnteredPassword(e.target.value)}
                    placeholder="Enter administrator password..."
                    autoFocus
                    className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>💡 Hint: Default password is <span className="text-amber-400 font-mono font-bold">admin</span></span>
                  <button
                    type="button"
                    onClick={() => setEnteredPassword('admin')}
                    className="text-purple-400 hover:text-purple-300 underline cursor-pointer"
                  >
                    Use default
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/40 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : 'Login to Portal'}
                </button>
              </div>

              {isUnlocked && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Portal is currently unlocked</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      lockPortal();
                      setSuccess('Portal locked.');
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer font-bold"
                  >
                    Lock Now
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Change Custom Password Mode Form (ONLY accessible from INSIDE when unlocked) */}
          {mode === 'change' && isUnlocked && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-[11px] text-amber-300/90 leading-relaxed">
                🔒 Authenticated Owner Access: Update your master administrator password. Once saved, only users who know this password can access administrative controls.
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  New Administrator Password:
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (e.g. AdminRB@2026)"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm New Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition shadow-lg shadow-amber-900/40 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save New Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
