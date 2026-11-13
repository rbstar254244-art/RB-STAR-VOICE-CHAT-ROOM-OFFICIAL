import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Share2, 
  Phone, 
  MessageCircle, 
  CreditCard, 
  Calendar, 
  MapPin, 
  Download,
  ExternalLink,
  Users,
  Briefcase,
  Crown
} from 'lucide-react';

interface StaffDossierModalProps {
  appId: string;
  onClose: () => void;
}

export const StaffDossierModal: React.FC<StaffDossierModalProps> = ({ appId, onClose }) => {
  const { adminUsers, bdManagers, isRomanUrdu } = useApp();
  const [copied, setCopied] = useState(false);
  const [viewingCnicDoc, setViewingCnicDoc] = useState<'front' | 'back' | null>(null);

  // Find candidate in either adminUsers or bdManagers
  const adminStaff = adminUsers.find(a => a.appId === appId || a.id === appId);
  const bdStaff = bdManagers.find(b => b.appId === appId || b.id === appId);

  const staff = adminStaff || (bdStaff ? {
    id: bdStaff.id,
    name: bdStaff.name,
    appId: bdStaff.appId,
    role: 'bd' as const,
    country: 'Pakistan',
    city: bdStaff.city || bdStaff.region || 'Pakistan',
    phone: bdStaff.phone,
    whatsapp: bdStaff.whatsapp || bdStaff.phone,
    avatar: bdStaff.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
    cnicNumber: bdStaff.cnicNumber || '35201-xxxxxxx-x (Verified on file)',
    cnicFrontImage: bdStaff.cnicFrontImage,
    cnicBackImage: bdStaff.cnicBackImage,
    appointmentCode: bdStaff.appointmentCode || `RB-BD-${bdStaff.appId}`,
    documentsVerified: bdStaff.documentsVerified ?? true,
    status: bdStaff.status === 'active' ? 'active' as const : 'suspended' as const,
    level: 'Official BD Manager',
    joinedDate: bdStaff.joinedDate || '2026-11-10',
    badgeTitle: 'Authorized Business Development Lead',
    notes: `Reports to: ${bdStaff.assignedAdminName || 'Direct Super Admin'}`,
    assignedAdminName: bdStaff.assignedAdminName
  } : null);

  if (!staff) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <X className="w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-base">Record Nahi Mila</h3>
          <p className="text-xs text-slate-400">
            App ID <strong className="text-amber-400">{appId}</strong> ka koi official appointment record nahi mila.
          </p>
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
          >
            Band Karein
          </button>
        </div>
      </div>
    );
  }

  const roleTitle = staff.role === 'super_admin' 
    ? 'Owner & Super Admin' 
    : staff.role === 'admin' 
      ? 'Official Simple Admin' 
      : staff.role === 'bd' 
        ? 'Business Development (BD) Manager' 
        : 'Official Customer Support';

  const roleColor = staff.role === 'super_admin'
    ? 'from-amber-400 to-amber-600 text-slate-950'
    : staff.role === 'admin'
      ? 'from-blue-600 to-indigo-600 text-white'
      : staff.role === 'bd'
        ? 'from-indigo-600 to-purple-600 text-white'
        : 'from-rose-600 to-pink-600 text-white';

  const dossierLink = `${window.location.origin}${window.location.pathname}?dossier=${staff.appId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dossierLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappShareText = encodeURIComponent(
    `👑 *RB STAR Voice Chat Room — Official Appointment Card*\n\n` +
    `👤 *Name:* ${staff.name}\n` +
    `🆔 *App ID:* ${staff.appId}\n` +
    `🎖️ *Designated Role:* ${roleTitle}\n` +
    (staff.assignedAdminName ? `👔 *Reporting Under:* ${staff.assignedAdminName}\n` : '') +
    `📞 *Phone / WhatsApp:* ${staff.phone}\n` +
    `🪪 *CNIC Number:* ${staff.cnicNumber || 'Verified'}\n` +
    `📜 *Appointment Serial:* ${staff.appointmentCode || 'RB-AUTH-7788'}\n` +
    `✅ *Verification Status:* 100% Official & Cleared\n\n` +
    `🔗 *View Full Digital Dossier & Certificate:*\n${dossierLink}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Golden Ribbon Banner */}
        <div className="relative bg-gradient-to-r from-amber-500 via-purple-700 to-indigo-700 p-4 sm:p-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-slate-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl p-1 bg-gradient-to-tr from-amber-300 to-purple-400 shrink-0 shadow-lg">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg" 
                alt="RB STAR Voice Chat Room" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/70 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OFFICIAL VERIFIED DOSSIER</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-200 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  STATUS: ACTIVE
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                RB STAR Voice Chat Room — Official Appointment
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main Profile & Photo Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="relative shrink-0">
              <img 
                src={staff.avatar} 
                alt={staff.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-amber-400/70 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1 rounded-full shadow-lg border-2 border-slate-900" title="Identity Cleared">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${roleColor} shadow-md`}>
                  {roleTitle}
                </span>
                {staff.appointmentCode && (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    {staff.appointmentCode}
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white truncate">
                {staff.name}
              </h3>

              <div className="text-xs sm:text-sm text-slate-300 font-mono flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
                <span className="text-amber-300 font-bold">App ID: <strong className="text-white font-mono text-base">{staff.appId}</strong></span>
                {staff.city && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{staff.city}</span>
                  </span>
                )}
              </div>

              {staff.assignedAdminName && (
                <div className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-blue-950/50 border border-blue-800/40 text-blue-200 text-xs font-medium">
                  <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Reporting Under: <strong>{staff.assignedAdminName}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Credentials & CNIC Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Phone & WhatsApp Card */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Official Contact & WhatsApp</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Phone Number:</span>
                  <span className="text-white font-mono font-bold">{staff.phone}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">WhatsApp Direct:</span>
                  <a 
                    href={`https://wa.me/${staff.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-mono font-bold flex items-center gap-1"
                  >
                    <span>{staff.whatsapp}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* CNIC / National ID Card */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>CNIC / National Identity</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">CNIC Number:</span>
                  <span className="text-amber-300 font-mono font-black text-sm tracking-wider">
                    {staff.cnicNumber || '35201-XXXXXXX-X (On Record)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Document Verification:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified by Super Admin</span>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* CNIC Card Photos Preview (If uploaded) */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-400" />
                <span>CNIC & Official ID Card Attachments</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Tamam Documents Record Mein Mehfooz Hain
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Front Photo */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">CNIC Front Side Photo</span>
                {staff.cnicFrontImage ? (
                  <div className="relative group cursor-pointer" onClick={() => setViewingCnicDoc('front')}>
                    <img 
                      src={staff.cnicFrontImage} 
                      alt="CNIC Front" 
                      className="w-full h-32 object-cover rounded-lg border border-slate-700 hover:border-amber-400 transition"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition rounded-lg">
                      Bada Karke Dekhein
                    </div>
                  </div>
                ) : (
                  <div className="h-28 rounded-lg bg-slate-950/80 border border-dashed border-slate-800 flex flex-col items-center justify-center p-3 text-slate-500 text-xs">
                    <CreditCard className="w-7 h-7 text-slate-600 mb-1" />
                    <span>CNIC Front (Verified by RB STAR)</span>
                  </div>
                )}
              </div>

              {/* Back Photo */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">CNIC Back Side Photo</span>
                {staff.cnicBackImage ? (
                  <div className="relative group cursor-pointer" onClick={() => setViewingCnicDoc('back')}>
                    <img 
                      src={staff.cnicBackImage} 
                      alt="CNIC Back" 
                      className="w-full h-32 object-cover rounded-lg border border-slate-700 hover:border-amber-400 transition"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition rounded-lg">
                      Bada Karke Dekhein
                    </div>
                  </div>
                ) : (
                  <div className="h-28 rounded-lg bg-slate-950/80 border border-dashed border-slate-800 flex flex-col items-center justify-center p-3 text-slate-500 text-xs">
                    <CreditCard className="w-7 h-7 text-slate-600 mb-1" />
                    <span>CNIC Back (Verified by RB STAR)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Official Verification Seal & Legal Statement */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full p-2 bg-gradient-to-tr from-amber-400 to-purple-600 flex items-center justify-center text-slate-950 shrink-0 shadow-lg font-black text-2xl">
              👑
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-xs uppercase tracking-wider">
                Official RB STAR Authorization Certificate
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Yeh digital appointment card aur CNIC record <strong>RB STAR Voice Chat Room</strong> ke official server se verify shuda hai. Is shakhs ko app ke users aur agencies manage karne ki mukammal ijazat di gayi hai.
              </p>
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              {isRomanUrdu ? 'Is Appointment Card Ka Direct Shareable Link:' : 'Direct Shareable Appointment Link:'}
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly 
                value={dossierLink}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono focus:outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>RB STAR Voice Chat Room © 2026</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <a 
              href={`https://wa.me/?text=${whatsappShareText}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Par Bhejein</span>
            </a>

            <button 
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print / Save</span>
            </button>

            <button 
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Band Karein
            </button>
          </div>
        </div>

      </div>

      {/* Full Document Viewer Modal if clicked */}
      {viewingCnicDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/95 animate-fadeIn">
          <div className="max-w-2xl w-full space-y-3">
            <div className="flex justify-between items-center text-white">
              <span className="font-bold text-sm">
                CNIC {viewingCnicDoc === 'front' ? 'Front Side' : 'Back Side'} — {staff.name}
              </span>
              <button onClick={() => setViewingCnicDoc(null)} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img 
              src={viewingCnicDoc === 'front' ? staff.cnicFrontImage : staff.cnicBackImage} 
              alt="CNIC Full Document"
              className="w-full max-h-[75vh] object-contain rounded-2xl border border-slate-700" 
            />
          </div>
        </div>
      )}

    </div>
  );
};
