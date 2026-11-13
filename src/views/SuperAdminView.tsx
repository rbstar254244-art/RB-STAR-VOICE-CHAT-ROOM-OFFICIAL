import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BannedUser, UserRole } from '../types';
import { 
  Shield, 
  Coins, 
  Users, 
  Headphones, 
  Building2, 
  TrendingUp, 
  Radio, 
  Key, 
  Lock, 
  Unlock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Plus,
  UserX,
  ShieldAlert,
  RotateCcw,
  Trash2,
  Briefcase,
  Link,
  CreditCard
} from 'lucide-react';

interface SuperAdminViewProps {
  onOpenPasswordModal: () => void;
  onOpenVerifyModal: () => void;
  onOpenBroadcastModal: () => void;
  onOpenTransferModal: () => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  onOpenPasswordModal,
  onOpenVerifyModal,
  onOpenBroadcastModal,
  onOpenTransferModal
}) => {
  const { 
    isUnlocked, 
    setActiveTab, 
    adminUsers, 
    addAdminUser,
    clearAllStaffExceptOwner,
    coinResellers, 
    agencies, 
    bdManagers, 
    addBDManager,
    tickets, 
    transactions,
    broadcasts,
    bannedUsers,
    banUser,
    unbanUser,
    appConfig,
    setDossierTargetAppId,
    setOnboardingModalOpen,
    setOnboardingTargetRole,
    staffApplications,
    approveStaffApplication,
    rejectStaffApplication
  } = useApp();

  // Ban management state
  const [banAppId, setBanAppId] = useState('');
  const [banUserName, setBanUserName] = useState('');
  const [banType, setBanType] = useState<BannedUser['banType']>('permanent_ban');
  const [banReason, setBanReason] = useState('');
  const [banFeedback, setBanFeedback] = useState('');

  // Admin Modal state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminAppId, setAdminAppId] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminRole, setAdminRole] = useState<UserRole>('super_admin');
  const [adminCountry, setAdminCountry] = useState('Pakistan');

  // BD under Simple Admin Modal state
  const [showBdModal, setShowBdModal] = useState(false);
  const [bdName, setBdName] = useState('');
  const [bdCode, setBdCode] = useState('');
  const [bdAppId, setBdAppId] = useState('');
  const [bdPhone, setBdPhone] = useState('');
  const [bdSelectedAdminId, setBdSelectedAdminId] = useState('');

  const simpleAdmins = adminUsers.filter(a => a.role === 'admin');

  const totalCirculatingCoins = coinResellers.reduce((acc, r) => acc + r.coinsAvailable, 0);
  const totalSoldCoins = coinResellers.reduce((acc, r) => acc + r.totalCoinsSold, 0);
  const urgentTickets = tickets.filter(t => t.status === 'open' && (t.priority === 'urgent' || t.priority === 'high')).length;

  const handleExecuteBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banAppId.trim()) return;

    banUser({
      appId: banAppId.trim(),
      userName: banUserName.trim() || `User_${banAppId.trim()}`,
      banType,
      reason: banReason.trim() || 'Super Admin Policy Enforcement'
    });

    setBanFeedback(`App ID ${banAppId} successfully banned!`);
    setBanAppId('');
    setBanUserName('');
    setBanReason('');
    setTimeout(() => setBanFeedback(''), 3000);
  };

  const handleCreateSimpleAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminAppId.trim()) return;

    addAdminUser({
      name: adminName.trim(),
      appId: adminAppId.trim(),
      role: adminRole,
      country: adminCountry,
      phone: adminPhone.trim(),
      whatsapp: adminPhone.trim(),
      avatar: '/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg',
      status: 'active',
      level: adminRole === 'super_admin' ? 'Supreme Super Admin (Owner)' : 'Simple Operations Admin',
      badgeTitle: adminRole === 'super_admin' ? 'Official Founder & Super Admin' : 'Official Operations Admin',
      notes: adminRole === 'super_admin' ? 'Supreme authority: ID Ban/Unban, Simple Admin assignment, BD oversight & coins.' : 'Simple Admin responsible for assigned BDs & Room Moderation.',
      assignedBdIds: []
    });

    setShowAdminModal(false);
    setAdminName('');
    setAdminAppId('');
    setAdminPhone('');
  };

  const handleCreateBdUnderAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bdName.trim() || !bdAppId.trim()) return;

    const parentAdmin = adminUsers.find(a => a.id === bdSelectedAdminId);

    addBDManager({
      name: bdName.trim(),
      bdCode: bdCode.trim().toUpperCase() || `BD-${Math.floor(100 + Math.random() * 900)}`,
      appId: bdAppId.trim(),
      region: 'Pakistan & GCC',
      phone: bdPhone.trim(),
      whatsapp: bdPhone.trim(),
      assignedAdminId: bdSelectedAdminId || undefined,
      assignedAdminName: parentAdmin ? `${parentAdmin.name} (ID: ${parentAdmin.appId})` : 'Direct Super Admin',
      targetMonthlyDiamonds: 25000000,
      status: 'active'
    });

    setShowBdModal(false);
    setBdName('');
    setBdCode('');
    setBdAppId('');
    setBdPhone('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome & Owner Security Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/50 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* RB STAR Emblem */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-purple-500 to-amber-300 shadow-2xl shadow-purple-950">
                <img 
                  src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg" 
                  alt="RB STAR Voice Chat Room" 
                  className="w-full h-full object-cover rounded-[22px]"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-amber-300 font-mono">
                👑 OFFICIAL
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>RB STAR Central Command</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono">
                  VOICE SERVER: 100% LIVE
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-amber-200 tracking-tight">
                RB STAR Voice Chat Room — Master Portal
              </h1>
              
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
                Official portal for RB STAR Voice Chat Room: Coin Resellers, Super Admin, Agencies, BD Leads & Staff Verification.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={onOpenTransferModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-950 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Transfer Coins</span>
            </button>

            <button
              onClick={onOpenBroadcastModal}
              className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-900/90 text-purple-200 border border-purple-600/50 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Global Broadcast</span>
            </button>

            <button
              onClick={onOpenPasswordModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Change Master Password</span>
            </button>
          </div>
        </div>

        {/* Live Broadcast Ticker if exists */}
        {broadcasts.length > 0 && (
          <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-purple-700/40 flex items-center gap-3 text-xs text-purple-200">
            <span className="px-2 py-0.5 rounded bg-purple-800 text-purple-200 font-bold text-[10px] uppercase">
              LIVE BROADCAST
            </span>
            <span className="truncate flex-1 text-slate-200">{broadcasts[0].message}</span>
            <span className="text-[10px] text-slate-400">{broadcasts[0].timestamp}</span>
          </div>
        )}
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('resellers')} 
          className="p-5 rounded-2xl bg-slate-900/80 border border-amber-900/40 hover:border-amber-500/60 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <Coins className="w-6 h-6" />
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
              STOCK
            </span>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {(totalCirculatingCoins / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-slate-400 mt-0.5 group-hover:text-amber-300 transition">
            Circulating Coin Pool
          </div>
        </div>

        <div 
          onClick={() => {
            const el = document.getElementById('ban-unban-station');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }} 
          className="p-5 rounded-2xl bg-slate-900/80 border border-rose-900/40 hover:border-rose-500/60 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <UserX className="w-6 h-6" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                SECURITY
              </span>
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {bannedUsers.length} Banned
          </div>
          <div className="text-xs text-slate-400 mt-0.5 group-hover:text-rose-300 transition">
            ID Ban & Moderation Hub
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('admins')} 
          className="p-5 rounded-2xl bg-slate-900/80 border border-blue-900/40 hover:border-blue-500/60 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
              STAFF
            </span>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {adminUsers.length} Officers
          </div>
          <div className="text-xs text-slate-400 mt-0.5 group-hover:text-blue-300 transition">
            Official App Staff Directory
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('cs')} 
          className="p-5 rounded-2xl bg-slate-900/80 border border-rose-900/40 hover:border-rose-500/60 transition shadow-lg cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <Headphones className="w-6 h-6" />
            {urgentTickets > 0 && (
              <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded animate-pulse">
                {urgentTickets} URGENT
              </span>
            )}
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {tickets.length} Tickets
          </div>
          <div className="text-xs text-slate-400 mt-0.5 group-hover:text-rose-300 transition">
            Customer Support Inquiries
          </div>
        </div>
      </div>

      {/* SUPER ADMIN MASTER FEATURE: ID BAN & UNBAN CONTROL STATION */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-950 border-2 border-rose-600/50 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-900/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full font-bold">
                  SUPER ADMIN SUPREME CONTROL
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Official In-App ID Ban & Unban Control Desk
              </h2>
              <p className="text-xs text-slate-300">
                Execute real-time account bans, temporary restrictions, mic mutes, and 1-click unban operations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              Total Banned IDs: <strong className="text-rose-400 font-bold">{bannedUsers.filter(b => b.status === 'banned').length}</strong>
            </span>
          </div>
        </div>

        {banFeedback && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{banFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Ban Execution Form */}
          <form onSubmit={handleExecuteBan} className="bg-slate-950/80 border border-rose-900/40 rounded-2xl p-5 space-y-3.5 shadow-xl">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 text-rose-400">
              <UserX className="w-4 h-4" />
              <span>Execute New ID Ban</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target User App ID:
              </label>
              <input
                type="text"
                required
                value={banAppId}
                onChange={(e) => setBanAppId(e.target.value)}
                placeholder="e.g. 992104 or 884012"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Nickname / Handle:
              </label>
              <input
                type="text"
                value={banUserName}
                onChange={(e) => setBanUserName(e.target.value)}
                placeholder="e.g. Abuser_King"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ban Severity Type:
              </label>
              <select
                value={banType}
                onChange={(e) => setBanType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="permanent_ban">🚫 Permanent Account Ban</option>
                <option value="temporary_ban">⏳ 7-Day Temporary Ban</option>
                <option value="voice_mute_24h">🔇 24-Hour Voice Room Mic Mute</option>
                <option value="device_ban">📱 Device / Hardware IMEI Ban</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Reason / Violation Evidence:
              </label>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="e.g. Abusive mic language, Fake seller fraud"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-lg shadow-rose-950 cursor-pointer"
            >
              <UserX className="w-4 h-4" />
              <span>Execute Ban On ID</span>
            </button>
          </form>

          {/* Right: Live Banned IDs Registry with Unban Action */}
          <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <span>Active Bans & Unban Registry</span>
              </h3>
              <span className="text-[11px] text-slate-400">Click "Unban" to restore immediately</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">User App ID</th>
                    <th className="pb-2 font-semibold">Username</th>
                    <th className="pb-2 font-semibold">Ban Type</th>
                    <th className="pb-2 font-semibold">Reason</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold text-right">Super Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bannedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        No banned App IDs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    bannedUsers.map(b => (
                    <tr key={b.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-2.5 font-mono font-bold text-amber-400">
                        {b.appId}
                      </td>
                      <td className="py-2.5 font-medium text-slate-200">
                        {b.userName}
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800 capitalize">
                          {b.banType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300 text-[11px] max-w-[150px] truncate">
                        {b.reason}
                      </td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          b.status === 'banned' 
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        {b.status === 'banned' ? (
                          <button
                            onClick={() => unbanUser(b.appId)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition flex items-center gap-1.5 ml-auto cursor-pointer shadow"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Unban ID</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => banUser({ appId: b.appId, userName: b.userName, banType: b.banType, reason: 'Re-banned by Super Admin' })}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white text-[10px] font-semibold transition ml-auto cursor-pointer"
                          >
                            Re-ban
                          </button>
                        )}
                      </td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SUPER ADMIN HIERARCHY: SIMPLE ADMINS & REPORTING BD MANAGERS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold">
                  HIERARCHY MANAGEMENT
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Simple Admins & Reporting BDs Structure
              </h2>
              <p className="text-xs text-slate-300">
                Assign BD managers directly under Simple Admins for regional operations and agency growth.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setOnboardingTargetRole('admin');
                setOnboardingModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/50 text-xs font-black transition flex items-center gap-1.5 shadow cursor-pointer"
              title="Share onboarding application link with candidate"
            >
              <Link className="w-3.5 h-3.5" />
              <span>📤 Send Application Link</span>
            </button>

            <button
              onClick={() => {
                setOnboardingTargetRole('admin');
                setOnboardingModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Simple Admin</span>
            </button>

            <button
              onClick={() => {
                setOnboardingTargetRole('bd');
                setOnboardingModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Assign BD Under Admin</span>
            </button>
          </div>
        </div>

        {/* Display Simple Admins & the BDs under them */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simpleAdmins.length > 0 ? (
            simpleAdmins.map(admin => {
              const bdsUnderThisAdmin = bdManagers.filter(b => b.assignedAdminId === admin.id || b.assignedAdminName?.includes(admin.appId));
              return (
                <div key={admin.id} className="p-5 rounded-2xl bg-slate-950/80 border border-blue-900/40 space-y-3.5 shadow-lg relative group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold uppercase">
                        Simple Admin
                      </span>
                      <h3 className="font-bold text-white text-base mt-1">{admin.name}</h3>
                      <div className="text-xs text-amber-400 font-mono mt-0.5">
                        App ID: <strong className="text-white">{admin.appId}</strong>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {admin.country}
                      </span>
                      <button
                        onClick={() => setDossierTargetAppId(admin.appId)}
                        className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="View & Share Official Appointment Link"
                      >
                        <Link className="w-3 h-3" />
                        <span>🔗 Link</span>
                      </button>
                    </div>
                  </div>

                  {/* BDs reporting under this admin */}
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 block flex items-center justify-between">
                      <span>Reporting BD Managers:</span>
                      <span className="text-indigo-400 font-mono font-bold">({bdsUnderThisAdmin.length})</span>
                    </span>

                    {bdsUnderThisAdmin.length > 0 ? (
                      <div className="space-y-1.5">
                        {bdsUnderThisAdmin.map(b => (
                          <div key={b.id} className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-slate-200 block">{b.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">ID: {b.appId} ({b.bdCode})</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                {(b.achievedDiamonds / 1000000).toFixed(1)}M 💎
                              </span>
                              <button
                                onClick={() => setDossierTargetAppId(b.appId)}
                                className="p-1 rounded-md bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/50"
                                title="BD Appointment Dossier"
                              >
                                <Link className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-900/40 rounded-xl border border-dashed border-slate-800 text-center text-[11px] text-slate-500">
                        No BDs assigned under this admin yet.
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 p-6 space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">
                No Simple Admins registered yet.
              </p>
              <button
                onClick={() => setShowAdminModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow"
              >
                + Create First Simple Admin
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Spotlight Grid: Resellers & Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Official Coin Resellers Spotlight */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Official Verified Resellers
                </h3>
                <p className="text-xs text-slate-400">
                  Official coin sellers with instant automated delivery
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('resellers')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {coinResellers.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 space-y-2">
                <Coins className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  No Coin Resellers added yet.
                </p>
                <button
                  onClick={() => setActiveTab('resellers')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow cursor-pointer"
                >
                  + Add Reseller
                </button>
              </div>
            ) : (
              coinResellers.slice(0, 3).map(reseller => (
              <div 
                key={reseller.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={reseller.avatar} 
                    alt={reseller.name}
                    className="w-11 h-11 rounded-xl object-cover border border-amber-500/40" 
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-xs">{reseller.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-amber-300 font-semibold">{reseller.resellerCode}</span>
                      <span>•</span>
                      <span>{reseller.country}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono">
                        {(reseller.coinsAvailable / 1000000).toFixed(1)}M coins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${reseller.whatsappNumber.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum,%20mujhy%20Voice%20Chat%20Room%20app%20ke%20coins%20chahiye.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <button
                    onClick={onOpenTransferModal}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 text-xs font-semibold transition"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Official Coin Transfers Ledger */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Recent Coin Transfers & Ledger
                </h3>
                <p className="text-xs text-slate-400">
                  Verified coin transfers and audit trail
                </p>
              </div>
            </div>

            <button
              onClick={onOpenTransferModal}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>+ New Transfer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {transactions.slice(0, 4).map(tx => (
              <div 
                key={tx.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold">
                    🪙
                  </div>
                  <div>
                    <div className="text-white font-bold flex items-center gap-1.5">
                      <span>To App ID:</span>
                      <span className="font-mono text-amber-300 font-black">{tx.buyerAppId}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>By: {tx.resellerName}</span>
                      <span>•</span>
                      <span>{tx.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-400">
                    +{tx.coinsAmount.toLocaleString()} 🪙
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 space-y-2 text-slate-500 text-xs">
                <Coins className="w-8 h-8 mx-auto text-slate-600" />
                <p>No coin transfers recorded yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row 2: In-App Admins Data & CS tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* In-App Admins & Staff Summary */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  App Administrators & Staff
                </h3>
                <p className="text-xs text-slate-400">
                  Transparent public & internal record of all appointed app admins
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('admins')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5 font-semibold">Official Admin</th>
                  <th className="pb-2.5 font-semibold">App ID</th>
                  <th className="pb-2.5 font-semibold">Designated Role</th>
                  <th className="pb-2.5 font-semibold">Region</th>
                  <th className="pb-2.5 font-semibold text-right">Dossier & Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {adminUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                      No admins added yet.
                    </td>
                  </tr>
                ) : (
                  adminUsers.slice(0, 4).map(admin => (
                    <tr key={admin.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 flex items-center gap-2.5">
                        <img 
                          src={admin.avatar} 
                          alt={admin.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700" 
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{admin.name}</div>
                          <div className="text-[10px] text-slate-400">{admin.level}</div>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-amber-400 font-bold">
                        {admin.appId}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-semibold">
                          {admin.badgeTitle}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">
                        {admin.country}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setDossierTargetAppId(admin.appId)}
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/40 text-amber-300 border border-amber-500/30 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          title="View & Share Official Appointment Link"
                        >
                          <Link className="w-3 h-3" />
                          <span>🔗 Link</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Support & Anti-Fraud Queue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-white text-sm">
                CS Support Tickets
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('cs')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2.5">
            {tickets.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 text-xs text-slate-500">
                No support tickets open.
              </div>
            ) : (
              tickets.slice(0, 3).map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-amber-400 font-bold">{ticket.ticketNumber}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                      ticket.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-xs truncate">
                    {ticket.subject}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between">
                    <span>App ID: <span className="text-purple-300 font-mono">{ticket.userAppId}</span></span>
                    <span>CS: {ticket.assignedCsName || 'Unassigned'}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setActiveTab('cs')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Open Full CS Center
          </button>
        </div>

      </div>

      {/* Row 3: Agencies & BD Performance Preview */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Agencies & BD Department
              </h3>
              <p className="text-xs text-slate-400">
                Talent agencies, host streaming hours & BD regional recruitment
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('bd')}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/40 text-xs font-semibold cursor-pointer"
            >
              BD Portal
            </button>
            <button
              onClick={() => setActiveTab('agencies')}
              className="px-3 py-1.5 rounded-lg bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 border border-teal-700/40 text-xs font-semibold cursor-pointer"
            >
              Agency Portal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agencies.length === 0 ? (
            <div className="col-span-full py-8 text-center bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 p-6 space-y-2 text-slate-500 text-xs">
              <Building2 className="w-8 h-8 mx-auto text-slate-600" />
              <p>No agencies registered yet.</p>
            </div>
          ) : (
            agencies.map(agency => (
              <div key={agency.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-teal-400 font-bold">{agency.agencyCode}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {agency.totalHosts} Hosts
                  </span>
                </div>
                <div className="font-bold text-white text-sm">{agency.agencyName}</div>
                <div className="text-xs text-slate-400">Owner: {agency.ownerName} (ID: {agency.ownerAppId})</div>
                
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Monthly Diamonds:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {(agency.monthlyDiamonds / 1000000).toFixed(1)}M 💎
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Create Admin / Super Admin */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Register Admin / Super Admin</span>
              </h3>
              <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSimpleAdmin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Role / Designation:</label>
                <select
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
                >
                  <option value="super_admin">👑 Super Admin (Full Supreme Control - ID Ban/Unban, BD, Coins)</option>
                  <option value="admin">🛡️ Simple Admin (Operations Admin - Assign BDs underneath)</option>
                  <option value="cs">🎧 Customer Support (CS Helpdesk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Admin Name:</label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Zeeshan Ahmed"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">App ID:</label>
                  <input
                    type="text"
                    required
                    value={adminAppId}
                    onChange={(e) => setAdminAppId(e.target.value)}
                    placeholder="e.g. 100001"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country:</label>
                  <input
                    type="text"
                    value={adminCountry}
                    onChange={(e) => setAdminCountry(e.target.value)}
                    placeholder="Pakistan"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Phone:</label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  placeholder="+92 311 2486463"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-[11px] text-blue-300">
                💡 After creating a Simple Admin, you can assign BD Managers directly under their supervision!
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-950 cursor-pointer"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign BD under Simple Admin */}
      {showBdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>Assign BD Under Simple Admin</span>
              </h3>
              <button onClick={() => setShowBdModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateBdUnderAdmin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select Parent Simple Admin:
                </label>
                {simpleAdmins.length > 0 ? (
                  <select
                    value={bdSelectedAdminId}
                    onChange={(e) => setBdSelectedAdminId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="">-- Direct Super Admin / Select Admin --</option>
                    {simpleAdmins.map(admin => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} (ID: {admin.appId})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                    ⚠️ Create an in-app Simple Admin first, or this BD manager will be directly assigned under Super Admin.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">BD Manager Name:</label>
                <input
                  type="text"
                  required
                  value={bdName}
                  onChange={(e) => setBdName(e.target.value)}
                  placeholder="e.g. Sardar Farhan (BD Lead)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">BD App ID:</label>
                  <input
                    type="text"
                    required
                    value={bdAppId}
                    onChange={(e) => setBdAppId(e.target.value)}
                    placeholder="e.g. 100004"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">BD Code:</label>
                  <input
                    type="text"
                    value={bdCode}
                    onChange={(e) => setBdCode(e.target.value)}
                    placeholder="e.g. BD-PK-01"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Phone:</label>
                <input
                  type="text"
                  value={bdPhone}
                  onChange={(e) => setBdPhone(e.target.value)}
                  placeholder="+92 311 2486463"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBdModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-950 cursor-pointer"
                >
                  Assign BD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
