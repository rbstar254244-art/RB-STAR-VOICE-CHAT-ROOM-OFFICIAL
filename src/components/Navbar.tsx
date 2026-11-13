import React, { useState } from 'react';
import { useApp, NavTab } from '../context/AppContext';
import { 
  Shield, 
  Coins, 
  Mic, 
  Users, 
  Headphones, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Radio, 
  Lock, 
  Unlock, 
  Key, 
  Search, 
  Sparkles,
  Settings,
  Bell,
  Menu,
  X,
  Volume2,
  MessageCircle,
  Sliders
} from 'lucide-react';

interface NavbarProps {
  onOpenPasswordModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenBroadcastModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenPasswordModal,
  onOpenVerifyModal,
  onOpenBroadcastModal
}) => {
  const { 
    activeTab, 
    setActiveTab, 
    isUnlocked, 
    lockPortal, 
    isRomanUrdu, 
    setIsRomanUrdu,
    searchQuery,
    setSearchQuery,
    appConfig
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onOpenVerifyModal();
    }
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Super Admin', icon: <Shield className="w-4 h-4 text-purple-400" /> },
    { id: 'site_editor', label: 'Site & Prices Editor', icon: <Sliders className="w-4 h-4 text-pink-400" /> },
    { id: 'free_coins', label: 'Free Coins Mint', icon: <Sparkles className="w-4 h-4 text-amber-300" /> },
    { id: 'resellers', label: 'Coin Resellers', icon: <Coins className="w-4 h-4 text-amber-400" /> },
    { id: 'admins', label: 'App Admins & Staff', icon: <Users className="w-4 h-4 text-blue-400" /> },
    { id: 'cs', label: 'CS Support', icon: <Headphones className="w-4 h-4 text-rose-400" /> },
    { id: 'bd', label: 'BD Managers', icon: <Briefcase className="w-4 h-4 text-indigo-400" /> },
    { id: 'agencies', label: 'Agencies & Hosts', icon: <Building2 className="w-4 h-4 text-teal-400" /> },
    { id: 'verification', label: 'Verify Staff ID', icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" /> },
    { id: 'connect', label: 'App Connect API', icon: <Radio className="w-4 h-4 text-cyan-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner / Ticker */}
      {appConfig.showTicker !== false && (
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-xs py-1.5 px-4 border-b border-purple-900/40 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
              {appConfig.officialBadge || 'Official Ecosystem Portal'}
            </span>
            <span className="text-slate-600">|</span>
            <span className="truncate text-slate-300 text-[11px]">
              {appConfig.tickerText || 'Official Directory for Voice Chat App Admins, Verified Resellers, Agencies & CS'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={onOpenBroadcastModal}
              className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 bg-purple-900/40 hover:bg-purple-900/60 px-2.5 py-0.5 rounded border border-purple-700/50 transition cursor-pointer"
            >
              <Bell className="w-3 h-3 text-purple-400" />
              <span>Broadcast</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & App Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={() => setActiveTab('overview')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <img 
                  src={appConfig.appLogo || "/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg"} 
                  alt={appConfig.appName} 
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-amber-400/80 shadow-lg shadow-purple-900/60 group-hover:scale-105 group-hover:ring-amber-300 transition-all duration-300"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-900"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-200 to-amber-400 tracking-tight">
                    {appConfig.appName}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded font-mono font-bold">
                    {appConfig.officialBadge || 'OFFICIAL'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>Audio Room Sync Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search / Fast Verification Bar - ONLY visible when admin is logged in */}
          {isUnlocked && (
            <form 
              onSubmit={handleSearchSubmit} 
              className="hidden md:flex items-center flex-1 max-w-md mx-2 relative"
            >
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Verify any Admin, Reseller or Agency ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-full pl-9 pr-24 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={onOpenVerifyModal}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1 transition shadow cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Verify</span>
                </button>
              </div>
            </form>
          )}

          {/* Right Action: Password Protection & Lock Status */}
          <div className="flex items-center gap-2.5">
            {isUnlocked ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPasswordModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-700/40 text-xs font-semibold transition cursor-pointer"
                  title="Configure master password"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">
                    Change Password
                  </span>
                </button>

                <button
                  onClick={lockPortal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-medium transition cursor-pointer"
                  title="Lock dashboard"
                >
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">
                    Lock Portal
                  </span>
                </button>
              </div>
            ) : null}

            {!isUnlocked && (
              <button
                onClick={onOpenPasswordModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 text-purple-200 hover:text-white text-xs font-semibold transition shadow cursor-pointer"
                title="Login"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Login</span>
              </button>
            )}

            {isUnlocked && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 rounded-lg border text-xs transition cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-purple-900/40 border-purple-500 text-purple-300' 
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="System Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            {/* Mobile Hamburger */}
            {isUnlocked && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Desktop Tabs Bar - ONLY visible when password is unlocked */}
        {isUnlocked && (
          <nav className="hidden lg:flex items-center space-x-1 py-1.5 overflow-x-auto no-scrollbar border-t border-slate-800/60">
            {navItems.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-900/70 to-indigo-900/70 text-white border border-purple-500/50 shadow-sm shadow-purple-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{appConfig.tabRenames?.[tab.id] || tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Mobile Menu Dropdown - ONLY for unlocked users */}
      {mobileMenuOpen && isUnlocked && (
        <div className="lg:hidden bg-slate-900/98 border-b border-slate-800 px-4 py-3 space-y-2">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Verify App ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200"
              />
            </div>
          </form>
          
          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-purple-900/60 text-white border border-purple-500/50'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span className="truncate">{appConfig.tabRenames?.[tab.id] || tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
