import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Globe, 
  Smartphone, 
  Sliders,
  Coins,
  ArrowRight,
  Database
} from 'lucide-react';

interface SettingsViewProps {
  onOpenPasswordModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenPasswordModal }) => {
  const { 
    masterPassword, 
    changeMasterPassword, 
    isUnlocked, 
    appConfig,
    updateAppConfig,
    backendStatus,
    setActiveTab
  } = useApp();

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [appNameInput, setAppNameInput] = useState(appConfig.appName);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingPwd) return;
    setMsg('');
    setErrorMsg('');

    if (!isUnlocked) {
      setErrorMsg('Please unlock the administrator portal first to change your password.');
      onOpenPasswordModal();
      return;
    }

    if (newPwd.length < 3) {
      setErrorMsg('Password must be at least 3 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setErrorMsg('Passwords do not match!');
      return;
    }

    setIsSavingPwd(true);
    try {
      const ok = await changeMasterPassword(newPwd);
      if (ok) {
        setMsg('Success! Your custom password has been updated and synced.');
        setNewPwd('');
        setConfirmPwd('');
      } else {
        setErrorMsg('Failed to update password. Please verify you are logged in.');
      }
    } finally {
      setIsSavingPwd(false);
    }
  };

  const handleSaveAppName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appNameInput.trim()) return;
    updateAppConfig({ appName: appNameInput.trim() });
    setMsg('App name updated successfully!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/50 rounded-3xl p-6 md:p-8 shadow-2xl flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black uppercase flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>RB STAR SECURITY & PASSWORDS</span>
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            RB STAR Voice Chat Room — Settings
          </h1>
          <p className="text-xs text-slate-300">
            Configure your custom master access code, InfinityFree MySQL sync, and RB STAR identity
          </p>
        </div>

        <div className="shrink-0">
          <img 
            src="./assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg" 
            alt="RB STAR" 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-xl shadow-purple-950" 
          />
        </div>
      </div>

      {/* Success / Error notification */}
      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Site & Prices Editor Highlight Banner */}
      <div className="bg-gradient-to-r from-pink-950/60 via-purple-900/40 to-slate-900 border-2 border-pink-500/50 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[11px] font-black uppercase flex items-center gap-1">
              <Sliders className="w-3 h-3" />
              Complete Site Customizer
            </span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>Coin Pricing, New Packages & Website Identity Editor</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Increase or decrease coin prices, add new packages, modify website title, announcements, support WhatsApp, or add showcase screenshots.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('site_editor')}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-pink-950 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Open Site & Prices Editor</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 1. Custom Master Password Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Custom Owner Master Password</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set your confidential owner passphrase to lock access from public users (stored in InfinityFree MySQL with BCRYPT when hosted)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
              isUnlocked ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}>
              {isUnlocked ? 'PORTAL UNLOCKED' : 'LOCKED'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                New Custom Password:
              </label>
              <input
                type="text"
                required
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="e.g. AdminRB@2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm New Password:
              </label>
              <input
                type="password"
                required
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-[11px] text-slate-500">
              Current active password length: <strong className="text-amber-400 font-mono">{masterPassword.length} characters</strong>
            </div>

            <button
              type="submit"
              disabled={isSavingPwd}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition shadow-lg shadow-amber-950 cursor-pointer disabled:opacity-50"
            >
              {isSavingPwd ? 'Saving...' : 'Save Password'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. App Name & Branding */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-purple-400" />
          <span>App Identity & Title</span>
        </h3>

        <form onSubmit={handleSaveAppName} className="flex gap-3">
          <input
            type="text"
            value={appNameInput}
            onChange={(e) => setAppNameInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Update Name
          </button>
        </form>
      </div>

      {/* 3. Language & UI Preference */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Language Setting</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Portal interface is configured in English
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-purple-900/40 text-purple-300 border border-purple-500/30 text-xs font-bold">
            English (Active)
          </span>
        </div>
      </div>

      {/* 4. InfinityFree PHP + MySQL & Free Hosting Guide */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Database className="w-5 h-5" />
            <h3 className="font-bold text-white text-base">
              InfinityFree Hosting & Full-Stack Deployment
            </h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono border ${
            backendStatus.isPhpHost && backendStatus.dbReady
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
          }`}>
            {backendStatus.isPhpHost && backendStatus.dbReady
              ? 'InfinityFree MySQL Live'
              : 'Ready for InfinityFree Upload'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          This portal includes a complete PHP 8 REST backend (<code className="text-emerald-300">api/*.php</code>), Apache <code className="text-emerald-300">.htaccess</code>, and a 16-table MySQL schema (<code className="text-emerald-300">database/infinityfree_schema.sql</code>) engineered specifically for InfinityFree free hosting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              1. Import MySQL SQL
            </span>
            <p className="text-[11px] text-slate-400">Import <code className="text-slate-200">database/infinityfree_schema.sql</code> in InfinityFree phpMyAdmin.</p>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold text-xs">2. Upload dist/ to htdocs</span>
            <p className="text-[11px] text-slate-400">Run <code className="text-slate-200">npm run build</code> and upload all files inside <code className="text-slate-200">dist/</code> into <code className="text-slate-200">htdocs/</code>.</p>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold text-xs">3. Edit htdocs/api/config.php</span>
            <p className="text-[11px] text-slate-400">Set your InfinityFree MySQL Host, DB Name, Username, Password & secret key.</p>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/40 text-[11px] font-mono text-emerald-300 flex items-center justify-between flex-wrap gap-2">
          <span>Build Command: <strong className="text-white">npm run build</strong> &rarr; Upload folder: <strong className="text-white">dist/ &rarr; htdocs/</strong></span>
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className="text-cyan-400 hover:text-cyan-300 underline font-sans font-semibold cursor-pointer"
          >
            Open MySQL Sync Panel &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
