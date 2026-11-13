import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  UserCheck, 
  CreditCard, 
  Camera, 
  Upload, 
  Phone, 
  CheckCircle2, 
  Shield, 
  Users, 
  Briefcase, 
  Link, 
  Copy,
  MapPin,
  FileText
} from 'lucide-react';

interface StaffOnboardingModalProps {
  onClose: () => void;
  defaultRole?: 'admin' | 'bd' | 'super_admin';
}

export const StaffOnboardingModal: React.FC<StaffOnboardingModalProps> = ({ 
  onClose,
  defaultRole = 'admin'
}) => {
  const { 
    adminUsers, 
    addAdminUser, 
    addBDManager, 
    submitStaffApplication,
    isRomanUrdu,
    setDossierTargetAppId
  } = useApp();

  const [role, setRole] = useState<'admin' | 'bd' | 'super_admin'>(defaultRole);
  const [name, setName] = useState('');
  const [appId, setAppId] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cnicNumber, setCnicNumber] = useState('');
  const [city, setCity] = useState('Lahore, Pakistan');
  const [notes, setNotes] = useState('');
  const [assignedAdminId, setAssignedAdminId] = useState('');
  
  // Images (as base64 or url)
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300');
  const [cnicFrontImage, setCnicFrontImage] = useState('');
  const [cnicBackImage, setCnicBackImage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successAppId, setSuccessAppId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Simple Admins list for BD dropdown
  const simpleAdmins = adminUsers.filter(a => a.role === 'admin');

  // Handle local file uploads converted to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'avatar' | 'cnicFront' | 'cnicBack') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'avatar') setAvatar(reader.result);
          if (target === 'cnicFront') setCnicFrontImage(reader.result);
          if (target === 'cnicBack') setCnicBackImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !appId.trim() || !phone.trim() || !cnicNumber.trim()) return;

    setSubmitting(true);

    const parentAdmin = simpleAdmins.find(a => a.id === assignedAdminId || a.appId === assignedAdminId);

    // Save directly to active staff and also register application
    if (role === 'super_admin') {
      addAdminUser({
        name: name.trim(),
        appId: appId.trim(),
        role: 'super_admin',
        country: 'Pakistan',
        city: city.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        cnicNumber: cnicNumber.trim(),
        cnicFrontImage: cnicFrontImage || undefined,
        cnicBackImage: cnicBackImage || undefined,
        appointmentCode: `RB-SUP-${appId.trim()}`,
        documentsVerified: true,
        avatar: avatar,
        status: 'active',
        level: 'Supreme Super Admin (Owner)',
        badgeTitle: 'Official Founder & Super Admin',
        notes: notes.trim() || 'Supreme authority: ID Ban/Unban, Simple Admin assignment, BD oversight & coins.'
      });
    } else if (role === 'admin') {
      addAdminUser({
        name: name.trim(),
        appId: appId.trim(),
        role: 'admin',
        country: 'Pakistan',
        city: city.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        cnicNumber: cnicNumber.trim(),
        cnicFrontImage: cnicFrontImage || undefined,
        cnicBackImage: cnicBackImage || undefined,
        appointmentCode: `RB-ADM-${appId.trim()}`,
        documentsVerified: true,
        avatar: avatar,
        status: 'active',
        level: 'Official Simple Admin',
        badgeTitle: 'Verified Operations Admin',
        notes: notes.trim() || 'Verified CNIC & Phone on appointment'
      });
    } else {
      addBDManager({
        name: name.trim(),
        bdCode: `BD-${appId.trim().slice(-4)}`,
        appId: appId.trim(),
        region: city.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        avatar: avatar,
        cnicNumber: cnicNumber.trim(),
        cnicFrontImage: cnicFrontImage || undefined,
        cnicBackImage: cnicBackImage || undefined,
        city: city.trim(),
        appointmentCode: `RB-BD-${appId.trim()}`,
        documentsVerified: true,
        assignedAdminId: parentAdmin ? parentAdmin.id : (assignedAdminId || undefined),
        assignedAdminName: parentAdmin ? `${parentAdmin.name} (ID: ${parentAdmin.appId})` : 'Direct Super Admin',
        targetMonthlyDiamonds: 25000000,
        status: 'active'
      });
    }

    // Also record in applications ledger
    submitStaffApplication({
      name: name.trim(),
      appId: appId.trim(),
      role: role,
      assignedAdminId: assignedAdminId || undefined,
      assignedAdminName: parentAdmin ? `${parentAdmin.name} (ID: ${parentAdmin.appId})` : undefined,
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      cnicNumber: cnicNumber.trim(),
      city: city.trim(),
      avatar: avatar,
      cnicFrontImage: cnicFrontImage || undefined,
      cnicBackImage: cnicBackImage || undefined,
      notes: notes.trim()
    });

    setSubmitting(false);
    setSuccessAppId(appId.trim());
  };

  const inviteLink = `${window.location.origin}${window.location.pathname}?apply=${role}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {isRomanUrdu ? 'Admin / BD Appointment & CNIC Form' : 'Staff Onboarding & Appointment Form'}
              </h3>
              <p className="text-xs text-slate-300">
                {isRomanUrdu 
                  ? 'Candidate ka phone, CNIC, pics aur mukammal details darj karein' 
                  : 'Enter complete CNIC verification, photo and phone credentials for official appointment'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Share Link Box at Top */}
        <div className="bg-slate-950/80 px-5 py-3 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Link className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{isRomanUrdu ? 'Candidate ko form bhej kar fill karwane ka direct link:' : 'Share this form directly with the candidate:'}</span>
          </div>
          <button 
            onClick={handleCopyInviteLink}
            className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Copy Form Link'}</span>
          </button>
        </div>

        {/* Success Screen after appointment */}
        {successAppId ? (
          <div className="p-8 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">
                {role === 'admin' ? 'Simple Admin Ban Gaya!' : 'BD Manager Ban Gaya!'}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                App ID <strong>{successAppId}</strong> ka official appointment card, CNIC verification aur shareable link foran tayyar ho chuka hai.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md mx-auto space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Candidate Name:</span>
                <span className="text-white font-bold">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">App ID:</span>
                <span className="text-amber-400 font-mono font-bold">{successAppId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CNIC Number:</span>
                <span className="text-white font-mono">{cnicNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-emerald-400 font-mono">{phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button 
                onClick={() => {
                  onClose();
                  setDossierTargetAppId(successAppId);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-950 cursor-pointer"
              >
                Appointment Card & Share Link Kholein
              </button>

              <button 
                onClick={() => {
                  setSuccessAppId(null);
                  setName('');
                  setAppId('');
                  setPhone('');
                  setWhatsapp('');
                  setCnicNumber('');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                + Ek Aur Staff Add Karein
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                {isRomanUrdu ? 'Role Select Karein (Kis Cheez Ka Link / Appointment Hai):' : 'Select Designated Role:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('super_admin')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    role === 'super_admin' 
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-950/40' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Super Admin</div>
                    <div className="text-[10px] text-slate-400">Ban/Unban & Full Control</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    role === 'admin' 
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-950/40' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">Simple Admin</div>
                    <div className="text-[10px] text-slate-400">Iske under BD honge</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('bd')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                    role === 'bd' 
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-950/40' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-indigo-400 shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-white">BD Manager</div>
                    <div className="text-[10px] text-slate-400">Admin ke under report karega</div>
                  </div>
                </button>
              </div>
            </div>

            {/* If BD selected, ask which Simple Admin they report to */}
            {role === 'bd' && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
                <label className="block text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>{isRomanUrdu ? 'Yeh BD kis Simple Admin ke under hoga?' : 'Reporting Simple Admin:'}</span>
                </label>
                <select
                  value={assignedAdminId}
                  onChange={(e) => setAssignedAdminId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Direct Super Admin (Owner)</option>
                  {simpleAdmins.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} (App ID: {admin.appId})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  {simpleAdmins.length === 0 
                    ? 'Tip: Pehle "+ Add Simple Admin" se Admin banayein taake BD unke under attach ho sake.' 
                    : 'BD ki sari progress is Simple Admin ke roster mein nazar aayegi.'}
                </p>
              </div>
            )}

            {/* Basic Info: Name & App ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isRomanUrdu ? 'Mukammal Naam (Full Name):' : 'Full Name:'} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Muhammad Hamza"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isRomanUrdu ? 'Voice App User ID (App ID):' : 'In-App User ID:'} *
                </label>
                <input
                  type="text"
                  required
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="e.g. 10005"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Phone & CNIC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRomanUrdu ? 'Mobile Number / WhatsApp:' : 'Phone / WhatsApp:'} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (!whatsapp) setWhatsapp(e.target.value);
                  }}
                  placeholder="+92 311 2486463"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isRomanUrdu ? 'CNIC Number (Shanakhti Card):' : 'CNIC Number:'} *</span>
                </label>
                <input
                  type="text"
                  required
                  value={cnicNumber}
                  onChange={(e) => setCnicNumber(e.target.value)}
                  placeholder="35201-1234567-1"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>{isRomanUrdu ? 'Shehar / Province (City):' : 'City / Region:'}</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lahore / Punjab"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Photos & Document Upload Section */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400" />
                <span>Candidate Ki Pic Aur CNIC Photos (Upload Karein)</span>
              </span>

              {/* Profile Photo */}
              <div className="flex items-center gap-4">
                <img 
                  src={avatar} 
                  alt="Avatar" 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shrink-0" 
                />
                <div className="flex-1 space-y-1">
                  <label className="block text-xs font-medium text-slate-300">
                    Candidate Profile Photo / Selfie:
                  </label>
                  <div className="flex gap-2">
                    <label className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Photo Upload Karein</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'avatar')} 
                        className="hidden" 
                      />
                    </label>
                    <input 
                      type="text" 
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* CNIC Front & Back */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                
                {/* CNIC Front */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">CNIC Front Side:</span>
                    {cnicFrontImage && <span className="text-[10px] text-emerald-400 font-bold">Uploaded ✓</span>}
                  </div>
                  {cnicFrontImage ? (
                    <img src={cnicFrontImage} alt="CNIC Front" className="w-full h-24 object-cover rounded-lg border border-slate-700" />
                  ) : (
                    <label className="h-24 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition text-center">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[11px] font-bold">Front Side Image Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'cnicFront')} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {/* CNIC Back */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">CNIC Back Side:</span>
                    {cnicBackImage && <span className="text-[10px] text-emerald-400 font-bold">Uploaded ✓</span>}
                  </div>
                  {cnicBackImage ? (
                    <img src={cnicBackImage} alt="CNIC Back" className="w-full h-24 object-cover rounded-lg border border-slate-700" />
                  ) : (
                    <label className="h-24 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex flex-col items-center justify-center p-2 text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer transition text-center">
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[11px] font-bold">Back Side Image Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'cnicBack')} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

              </div>
            </div>

            {/* Note / Responsibility */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isRomanUrdu ? 'Notes / Zimadari (Optional):' : 'Additional Notes / Authorization Scope:'}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Authorized to resolve complaints, handle agency onboarding and manage BD network."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={submitting}
                className="flex-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-indigo-950 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {role === 'admin' 
                    ? 'Simple Admin Save & Appointment Link Generate Karein' 
                    : 'BD Manager Save & Appointment Link Generate Karein'}
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
