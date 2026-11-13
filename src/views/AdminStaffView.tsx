import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminUser, UserRole } from '../types';
import { 
  Users, 
  Shield, 
  CheckCircle2, 
  Plus, 
  Search, 
  Phone, 
  MessageCircle, 
  Trash2, 
  Edit3, 
  Award, 
  Sparkles,
  Lock,
  Filter,
  Link,
  CreditCard,
  Copy
} from 'lucide-react';

interface AdminStaffViewProps {
  onOpenPasswordModal: () => void;
}

export const AdminStaffView: React.FC<AdminStaffViewProps> = ({ onOpenPasswordModal }) => {
  const { 
    adminUsers, 
    addAdminUser, 
    updateAdminUser, 
    deleteAdminUser, 
    clearAllStaffExceptOwner,
    isUnlocked, 
    isRomanUrdu,
    setDossierTargetAppId,
    setOnboardingModalOpen,
    setOnboardingTargetRole,
    staffApplications,
    approveStaffApplication,
    rejectStaffApplication
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New admin form state
  const [name, setName] = useState('');
  const [appId, setAppId] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [country, setCountry] = useState('Pakistan');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [level, setLevel] = useState('Simple Operations Admin');
  const [badgeTitle, setBadgeTitle] = useState('Official Operations Admin');
  const [assignedAdminId, setAssignedAdminId] = useState('');
  const [notes, setNotes] = useState('');

  const simpleAdmins = adminUsers.filter(a => a.role === 'admin');

  const filteredAdmins = adminUsers.filter(a => {
    const matchRole = roleFilter === 'all' || a.role === roleFilter;
    const matchSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.appId.includes(searchTerm) ||
                        a.badgeTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnlocked) {
      onOpenPasswordModal();
      return;
    }

    const parentAdmin = adminUsers.find(a => a.id === assignedAdminId);

    addAdminUser({
      name: name.trim(),
      appId: appId.trim(),
      role,
      country,
      phone: phone.trim() || whatsapp.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      status: 'active',
      level,
      badgeTitle,
      assignedAdminId: role === 'bd' ? assignedAdminId : undefined,
      assignedAdminName: role === 'bd' ? (parentAdmin ? `${parentAdmin.name} (ID: ${parentAdmin.appId})` : 'Direct Super Admin') : undefined,
      notes
    });

    setShowAddModal(false);
    setName('');
    setAppId('');
    setPhone('');
    setWhatsapp('');
    setAssignedAdminId('');
    setNotes('');
  };

  const getRoleBadgeStyle = (userRole: UserRole) => {
    switch (userRole) {
      case 'super_admin':
        return 'bg-purple-900/60 text-purple-300 border-purple-500/50';
      case 'admin':
        return 'bg-blue-900/60 text-blue-300 border-blue-500/50';
      case 'cs':
        return 'bg-rose-900/60 text-rose-300 border-rose-500/50';
      case 'bd':
        return 'bg-indigo-900/60 text-indigo-300 border-indigo-500/50';
      case 'coin_reseller':
        return 'bg-amber-900/60 text-amber-300 border-amber-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-black uppercase flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>OFFICIAL APP STAFF REGISTRY</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Database
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
            {isRomanUrdu ? 'In-App Admins & Official Staff Directory' : 'App Administrators & Staff Directory'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            {isRomanUrdu 
              ? '"jo admin ho app main un sab ka data idr show ho website main" — Super Admin, Simple Admins, aur unke under kaam karne wale BD Managers ka complete live record.'
              : 'Complete transparent registry of authorized staff: Super Admin, Simple Operations Admins, and reporting BD leads.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (confirm(isRomanUrdu ? 'Kya aap tamam sample IDs remove karna chahte hain taake sirf aap ki apni IDs rahein?' : 'Clear all sample dummy IDs and show only your created IDs?')) {
                clearAllStaffExceptOwner();
              }
            }}
            className="px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Remove sample dummy staff"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isRomanUrdu ? 'Dummy IDs Remove Karein' : 'Clear Sample IDs'}</span>
          </button>

          <button
            onClick={() => {
              setOnboardingTargetRole('admin');
              setOnboardingModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-purple-950 cursor-pointer"
            title="Share recruitment link with candidate to submit their CNIC, phone and photos"
          >
            <Link className="w-4 h-4" />
            <span>📤 Send Application Link</span>
          </button>

          <button
            onClick={() => {
              if (!isUnlocked) onOpenPasswordModal();
              else {
                setOnboardingTargetRole('admin');
                setOnboardingModalOpen(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-950 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRomanUrdu ? '+ Naya Admin / BD Add Karein' : '+ Register Staff Member'}</span>
          </button>
        </div>
      </div>

      {/* Pending Applications Review Queue (If any candidates submitted via link) */}
      {staffApplications.filter(a => a.status === 'pending').length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/40 border border-amber-500/50 space-y-3 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span>{isRomanUrdu ? 'Nayi Staff Darkhwastein (Pending Candidate Applications):' : 'Pending Staff Applications:'}</span>
                <span className="bg-amber-500 text-slate-950 font-mono font-black text-xs px-2 py-0.5 rounded-full">
                  {staffApplications.filter(a => a.status === 'pending').length}
                </span>
              </h4>
            </div>
            <span className="text-[11px] text-amber-300 font-mono">
              Online Link Se Aayi Hui Darkhwastein
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {staffApplications.filter(a => a.status === 'pending').map(app => (
              <div key={app.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={app.avatar} alt={app.name} className="w-11 h-11 rounded-xl object-cover border border-amber-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-xs truncate">{app.name}</h5>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase font-bold">
                        {app.role === 'admin' ? 'Simple Admin' : 'BD Manager'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono mt-0.5">
                      <span className="text-amber-400">ID: {app.appId}</span>
                      <span>•</span>
                      <span>{app.phone}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      CNIC: <strong className="text-white">{app.cnicNumber}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => setDossierTargetAppId(app.appId)}
                    className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Photos & CNIC Check Karein</span>
                  </button>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => approveStaffApplication(app.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer transition shadow"
                    >
                      ✓ Manzoor (Approve)
                    </button>
                    <button
                      onClick={() => rejectStaffApplication(app.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] cursor-pointer transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={isRomanUrdu ? "Admin name ya App ID likhein..." : "Search by name, App ID or badge..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Staff' },
            { id: 'super_admin', label: 'Super Admin' },
            { id: 'admin', label: 'Admins' },
            { id: 'cs', label: 'CS Support' },
            { id: 'bd', label: 'BD Leads' },
            { id: 'coin_reseller', label: 'Resellers' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                roleFilter === f.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAdmins.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 p-8 space-y-4">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isRomanUrdu ? 'Abhi koi Admin, Super Admin ya Staff add nahi hua' : 'No staff or admins registered yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isRomanUrdu 
                ? 'Aap ne abhi tak kisi ko Admin ya BD nahi banaya. Yahan sirf wohi ID show hogi jis ko aap khud add ya approve karein gay.' 
                : 'Only staff and administrators added or approved by you will appear in this registry.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-950 cursor-pointer"
              >
                {isRomanUrdu ? '+ Naya Admin / Staff Add Karein' : '+ Register Staff Member'}
              </button>
              <button
                onClick={() => {
                  setOnboardingTargetRole('admin');
                  setOnboardingModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/50 text-xs font-bold cursor-pointer"
              >
                {isRomanUrdu ? '📤 Candidate Ko Form Link Bhejein' : '📤 Send Application Link'}
              </button>
            </div>
          </div>
        ) : (
          filteredAdmins.map(admin => (
          <div 
            key={admin.id}
            className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 rounded-3xl p-6 space-y-4 shadow-xl transition relative group"
          >
            {/* Top avatar & title */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src={admin.avatar} 
                  alt={admin.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-blue-500/40 shadow-md" 
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-sm">{admin.name}</h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {admin.level}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getRoleBadgeStyle(admin.role)}`}>
                {admin.role.replace('_', ' ')}
              </span>
            </div>

            {/* In-App ID & Country */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">In-App ID:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">{admin.appId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Region:</span>
                <span className="text-slate-200 font-semibold">{admin.country}</span>
              </div>
            </div>

            {/* Official Badge & Responsibilities */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold text-slate-200">{admin.badgeTitle}</span>
              </div>
              {admin.role === 'bd' && (
                <div className="p-2 rounded-xl bg-slate-950 border border-indigo-900/40 text-[11px] text-indigo-300">
                  <span className="text-slate-500 block text-[9px] uppercase font-semibold">Under Simple Admin:</span>
                  <span className="font-bold truncate block">{admin.assignedAdminName || 'Direct Super Admin'}</span>
                </div>
              )}

              {/* CNIC Credential */}
              <div className="flex items-center justify-between text-xs px-1 py-0.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>CNIC:</span>
                </span>
                <span className="font-mono text-amber-300 font-bold text-[11px]">
                  {admin.cnicNumber || '35201-xxxxxxx-x (Verified)'}
                </span>
              </div>

              {admin.notes && (
                <p className="text-[11px] text-slate-400 leading-relaxed pl-1">
                  {admin.notes}
                </p>
              )}
            </div>

            {/* Footer with Appointment Link, WhatsApp & Admin actions */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setDossierTargetAppId(admin.appId)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/40 hover:to-purple-500/40 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Official Appointment Link & Dossier"
                >
                  <Link className="w-3.5 h-3.5" />
                  <span>🔗 Link</span>
                </button>

                <a
                  href={`https://wa.me/${admin.whatsapp.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(admin.name)},%20I%20verified%20your%20App%20ID%20${admin.appId}%20on%20the%20Official%20RB%20STAR%20Website.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </a>
              </div>

              {isUnlocked && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateAdminUser(admin.id, { 
                      status: admin.status === 'active' ? 'suspended' : 'active' 
                    })}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                      admin.status === 'active' 
                        ? 'bg-slate-800 text-slate-400 hover:text-amber-300' 
                        : 'bg-rose-950/60 text-rose-300 border border-rose-800'
                    }`}
                  >
                    {admin.status === 'active' ? 'Active' : 'Suspended'}
                  </button>

                  {admin.role !== 'super_admin' && (
                    <button
                      onClick={() => deleteAdminUser(admin.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      title="Delete Staff Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )))}
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>{isRomanUrdu ? 'Naya App Admin Ya Staff Shamil Karein' : 'Register New App Staff / Admin'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name & Title:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rana Hammad (Simple Admin)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">In-App User ID:</label>
                  <input
                    type="text"
                    required
                    value={appId}
                    onChange={(e) => setAppId(e.target.value)}
                    placeholder="e.g. 100002"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Role / Department:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="admin">Simple Admin (Operations - BD iske under hongay)</option>
                    <option value="bd">BD Manager (Simple Admin ke under reporting)</option>
                    <option value="super_admin">Super Admin (Founder / Owner)</option>
                    <option value="cs">Customer Support (CS)</option>
                    <option value="coin_reseller">Official Coin Reseller</option>
                  </select>
                </div>
              </div>

              {/* If Role is BD, show Simple Admin selection */}
              {role === 'bd' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isRomanUrdu ? 'Kis Simple Admin K Under Assign Karna Ha?:' : 'Reporting Simple Admin:'}
                  </label>
                  {simpleAdmins.length > 0 ? (
                    <select
                      value={assignedAdminId}
                      onChange={(e) => setAssignedAdminId(e.target.value)}
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
                      💡 No Simple Admin created yet. This BD will report directly under the Super Admin.
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country / Region:</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Phone:</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+92 311 2486463"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Official Badge / Designation Title:</label>
                <input
                  type="text"
                  value={badgeTitle}
                  onChange={(e) => setBadgeTitle(e.target.value)}
                  placeholder="e.g. Official Room Marshal, CS Investigator"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Duties / Internal Notes:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Manages Punjab voice rooms and disputes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-950 cursor-pointer"
                >
                  {isRomanUrdu ? 'Admin Save Karein' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
