import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BDManager } from '../types';
import { 
  Briefcase, 
  TrendingUp, 
  Building2, 
  Award, 
  Plus, 
  MessageCircle, 
  Phone, 
  Target, 
  DollarSign,
  CheckCircle2,
  Link,
  CreditCard
} from 'lucide-react';

interface BDPortalViewProps {
  onOpenPasswordModal: () => void;
}

export const BDPortalView: React.FC<BDPortalViewProps> = ({ onOpenPasswordModal }) => {
  const { 
    bdManagers, 
    addBDManager, 
    adminUsers,
    agencies, 
    isUnlocked, 
    isRomanUrdu,
    setDossierTargetAppId,
    setOnboardingModalOpen,
    setOnboardingTargetRole
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);

  // New BD Form
  const [name, setName] = useState('');
  const [bdCode, setBdCode] = useState('');
  const [appId, setAppId] = useState('');
  const [region, setRegion] = useState('Pakistan & GCC');
  const [phone, setPhone] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [targetDiamonds, setTargetDiamonds] = useState<number>(30000000);

  const simpleAdmins = adminUsers.filter(a => a.role === 'admin');

  const totalRecruitedAgencies = bdManagers.reduce((acc, b) => acc + b.totalAgenciesRecruited, 0);
  const totalAchievedDiamonds = bdManagers.reduce((acc, b) => acc + b.achievedDiamonds, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnlocked) {
      onOpenPasswordModal();
      return;
    }

    const parentAdmin = adminUsers.find(a => a.id === selectedAdminId);

    addBDManager({
      name: name.trim(),
      bdCode: bdCode.trim().toUpperCase() || `BD-${Math.floor(100 + Math.random() * 900)}`,
      appId: appId.trim(),
      region,
      phone: phone.trim(),
      whatsapp: phone.trim(),
      assignedAdminId: selectedAdminId || undefined,
      assignedAdminName: parentAdmin ? `${parentAdmin.name} (ID: ${parentAdmin.appId})` : 'Super Admin Direct',
      targetMonthlyDiamonds: Number(targetDiamonds),
      status: 'active'
    });

    setShowAddModal(false);
    setName('');
    setBdCode('');
    setAppId('');
    setPhone('');
    setSelectedAdminId('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950 border border-indigo-800/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black uppercase flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>BD (BUSINESS DEVELOPMENT) HEADQUARTERS</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Regional Agency Recruitment
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
            {isRomanUrdu ? 'Official BD Managers & Talent Acquisition' : 'Business Development (BD) Portal'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            {isRomanUrdu 
              ? 'Nayi Agencies ko app me onboard karna, weekly diamond targets monitor karna, aur BD leads ka commission hisab karna.'
              : 'Empower regional directors to scout voice talent, scale agency operations, and audit performance targets.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => {
              setOnboardingTargetRole('bd');
              setOnboardingModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
            title="Share onboarding application link with BD candidate"
          >
            <Link className="w-4 h-4" />
            <span>📤 Send BD Form Link</span>
          </button>

          <button
            onClick={() => {
              if (!isUnlocked) onOpenPasswordModal();
              else {
                setOnboardingTargetRole('bd');
                setOnboardingModalOpen(true);
              }
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-950 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRomanUrdu ? '+ Naya BD Lead Register Karein' : '+ Register BD Lead'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-900/40 shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Total BD Managers:</span>
          <span className="text-2xl font-black text-white font-mono mt-1 block">
            {bdManagers.length} Officers
          </span>
          <span className="text-[11px] text-indigo-300 mt-1 block">Managing regional agency growth</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-teal-900/40 shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Total Onboarded Agencies:</span>
          <span className="text-2xl font-black text-teal-400 font-mono mt-1 block">
            {totalRecruitedAgencies} Agencies
          </span>
          <span className="text-[11px] text-teal-300 mt-1 block">Registered in Pakistan, UAE & India</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-900/40 shadow-lg">
          <span className="text-xs text-slate-400 block font-medium">Diamonds Circulation:</span>
          <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
            {(totalAchievedDiamonds / 1000000).toFixed(1)}M 💎
          </span>
          <span className="text-[11px] text-amber-300 mt-1 block">Current monthly production</span>
        </div>
      </div>

      {/* BD Managers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bdManagers.length > 0 ? (
          bdManagers.map(bd => {
            const progressPercent = Math.min(100, Math.round((bd.achievedDiamonds / bd.targetMonthlyDiamonds) * 100));
            return (
              <div 
                key={bd.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 space-y-4 shadow-xl transition relative group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-base">{bd.name}</h3>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Code: <strong className="text-indigo-400">{bd.bdCode}</strong>
                      <span className="mx-1 text-slate-600">|</span>
                      App ID: <span className="text-purple-300">{bd.appId}</span>
                    </div>
                  </div>

                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700 px-2 py-0.5 rounded-full font-mono">
                    {bd.region}
                  </span>
                </div>

                {/* Reporting Simple Admin Badge */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-900/40 text-xs">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Under Simple Admin:</span>
                  <span className="font-bold text-indigo-300 block truncate mt-0.5">
                    {bd.assignedAdminName || 'Super Admin Direct'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Monthly Target Progress:</span>
                    <span className="font-mono font-bold text-amber-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>{(bd.achievedDiamonds / 1000000).toFixed(1)}M Diamonds</span>
                    <span>Target: {(bd.targetMonthlyDiamonds / 1000000).toFixed(0)}M</span>
                  </div>
                </div>

                {/* Stats Box */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Agencies Recruited:</span>
                    <span className="font-bold text-white font-mono">{bd.totalAgenciesRecruited}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Estimated Commission:</span>
                    <span className="font-bold text-emerald-400 font-mono">${bd.commissionEarnedUSD}</span>
                  </div>
                </div>

                {/* CNIC Credential */}
                <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>CNIC:</span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold text-[11px]">
                    {bd.cnicNumber || '35201-xxxxxxx-x (Verified)'}
                  </span>
                </div>

                {/* Actions: Appointment Link & WhatsApp */}
                <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => setDossierTargetAppId(bd.appId)}
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/40 hover:to-purple-500/40 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Official Appointment Card & Dossier"
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>🔗 Appointment Link</span>
                  </button>

                  <a
                    href={`https://wa.me/${bd.whatsapp.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(bd.name)},%20I%20verified%20your%20BD%20App%20ID%20${bd.appId}%20on%20RB%20STAR%20Official%20Website.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition flex items-center justify-center"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 p-8 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isRomanUrdu ? 'Abhi Tak Koi BD Manager Assign Nahi Hua' : 'No BD Managers Onboarded Yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isRomanUrdu 
                ? 'Sirf wohi BD idhar show hon gay jin ko aap Simple Admin ke under create ya assign karein gay!'
                : 'Only BD Managers created and assigned by you will appear in this registry.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
            >
              {isRomanUrdu ? '+ Pehla BD Manager Register Karein' : '+ Add First BD Manager'}
            </button>
          </div>
        )}
      </div>

      {/* Add BD Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>{isRomanUrdu ? 'Naya BD Manager Add Karein' : 'Register BD Manager'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isRomanUrdu ? 'Kis Simple Admin K Under Rakhna Ha?:' : 'Reporting Simple Admin:'}
                </label>
                {simpleAdmins.length > 0 ? (
                  <select
                    value={selectedAdminId}
                    onChange={(e) => setSelectedAdminId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    <option value="">-- Direct Super Admin / Select Simple Admin --</option>
                    {simpleAdmins.map(admin => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name} (ID: {admin.appId})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-2.5 bg-amber-950/40 border border-amber-800/40 rounded-xl text-xs text-amber-300">
                    💡 No Simple Admin created yet. This BD will report directly under the Super Admin.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">BD Director / Manager Name:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanvir Malik"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">BD Code:</label>
                  <input
                    type="text"
                    required
                    value={bdCode}
                    onChange={(e) => setBdCode(e.target.value)}
                    placeholder="e.g. BD-PK-04"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">App ID:</label>
                  <input
                    type="text"
                    required
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="e.g. 100030"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Region:</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. Pakistan & Middle East"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Phone:</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+923112486463"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Diamonds Target:</label>
                <input
                  type="number"
                  value={targetDiamonds}
                  onChange={(e) => setTargetDiamonds(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-950 cursor-pointer"
                >
                  {isRomanUrdu ? 'BD Save Karein' : 'Register BD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
