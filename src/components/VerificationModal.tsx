import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Search,
  Award,
  Sparkles,
  Link,
  CreditCard
} from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const { lookupId, isRomanUrdu, searchQuery, setSearchQuery, setDossierTargetAppId } = useApp();
  const [inputVal, setInputVal] = useState(initialQuery || searchQuery || '');
  const [lastSearched, setLastSearched] = useState(initialQuery || searchQuery || '');

  if (!isOpen) return null;

  const result = lastSearched ? lookupId(lastSearched) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      setLastSearched(inputVal.trim());
      setSearchQuery(inputVal.trim());
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'SUPER ADMIN (FOUNDER)', color: 'bg-purple-900/60 text-purple-300 border-purple-500/50' };
      case 'coin_reseller':
        return { label: 'OFFICIAL COIN RESELLER', color: 'bg-amber-900/60 text-amber-300 border-amber-500/50' };
      case 'admin':
        return { label: 'APP ADMIN & MARSHAL', color: 'bg-blue-900/60 text-blue-300 border-blue-500/50' };
      case 'cs':
        return { label: 'CUSTOMER SERVICE (CS)', color: 'bg-rose-900/60 text-rose-300 border-rose-500/50' };
      case 'bd':
        return { label: 'BD REGIONAL LEAD', color: 'bg-indigo-900/60 text-indigo-300 border-indigo-500/50' };
      case 'agency':
        return { label: 'VERIFIED TALENT AGENCY', color: 'bg-teal-900/60 text-teal-300 border-teal-500/50' };
      default:
        return { label: 'VERIFIED OFFICIAL', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/50' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-purple-900/80 via-indigo-900/80 to-slate-900 p-6 border-b border-slate-800">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg" 
                alt="RB STAR" 
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-amber-400 shadow-lg shadow-purple-950" 
              />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span>{isRomanUrdu ? 'RB STAR Official Verification Center' : 'RB STAR Staff Authentication'}</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                {isRomanUrdu 
                  ? 'RB STAR app ke kisi bhi Admin ya Coin Reseller ki ID check karein' 
                  : 'Instant security certificate verifying legitimate RB STAR staff'}
              </p>
            </div>
          </div>

          {/* Search Form inside Modal */}
          <form onSubmit={handleSearch} className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={isRomanUrdu ? "App ID, Reseller Code (e.g. 100001, 777001, CR-PK-01)..." : "Enter App ID or Code..."}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                autoFocus
                className="w-full bg-slate-950/90 border border-slate-700 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-950 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isRomanUrdu ? 'Check Karein' : 'Verify Now'}</span>
            </button>
          </form>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {!lastSearched ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                <Search className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-300 font-medium">
                {isRomanUrdu ? 'Kisi bhi App ID ka number likh kar check karein' : 'Enter an App ID or Reseller Code to verify authenticity'}
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <span className="text-[11px] text-slate-500">Sample IDs:</span>
                <button 
                  onClick={() => { setInputVal('100001'); setLastSearched('100001'); }}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-purple-300 hover:bg-slate-700 cursor-pointer"
                >
                  100001 (Owner)
                </button>
                <button 
                  onClick={() => { setInputVal('777001'); setLastSearched('777001'); }}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-amber-300 hover:bg-slate-700 cursor-pointer"
                >
                  777001 (Reseller)
                </button>
                <button 
                  onClick={() => { setInputVal('AG-991'); setLastSearched('AG-991'); }}
                  className="text-xs px-2.5 py-1 rounded bg-slate-800 text-teal-300 hover:bg-slate-700 cursor-pointer"
                >
                  AG-991 (Agency)
                </button>
              </div>
            </div>
          ) : result?.found ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Success Badge Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/50 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
                      100% OFFICIAL VERIFIED
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                      AUTHENTICATED
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {result.data.name}
                  </h3>
                </div>
              </div>

              {/* Identity Details Card */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    {result.data.avatar && (
                      <img 
                        src={result.data.avatar} 
                        alt={result.data.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/50 shadow" 
                      />
                    )}
                    <div>
                      <div className="text-sm font-bold text-white">{result.data.name}</div>
                      <div className="text-xs text-slate-400 font-mono">
                        App ID: <span className="text-amber-400 font-bold">{result.data.appId || result.data.agencyCode}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${getRoleBadge(result.type || '').color}`}>
                    {getRoleBadge(result.type || '').label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Official Role:</span>
                    <span className="text-slate-200 font-bold mt-0.5 block">
                      {result.data.badgeTitle || result.data.level || 'Official Staff'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Country / Region:</span>
                    <span className="text-slate-200 font-bold mt-0.5 block">
                      {result.data.country || result.data.region || 'Official Global'}
                    </span>
                  </div>

                  {(result.data.whatsapp || result.data.whatsappNumber) && (
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Official WhatsApp:</span>
                        <span className="text-emerald-400 font-mono font-bold mt-0.5 block">
                          {result.data.whatsapp || result.data.whatsappNumber}
                        </span>
                      </div>
                      <a
                        href={`https://wa.me/${(result.data.whatsapp || result.data.whatsappNumber).replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum,%20I%20verified%20your%20ID%20on%20the%20Official%20Voice%20App%20Portal`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Additional Reseller stats */}
                {result.type === 'coin_reseller' && (
                  <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Verified Since:</span>
                      <span className="font-mono text-amber-300">{result.data.verifiedSince}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Seller Rating:</span>
                      <span className="font-bold text-amber-400">⭐ {result.data.rating} / 5.0</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Available Coin Balance:</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {Number(result.data.coinsAvailable).toLocaleString()} Coins
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Safety seal */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center gap-2.5 text-xs text-purple-200">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <span>
                  {isRomanUrdu 
                    ? 'Yeh ID bilkul mehfooz aur certified ha. RB STAR server par inka appointment aur CNIC record mojood hai.'
                    : 'This ID is authentic and certified. Verified official staff with authentic credentials on RB STAR server.'}
                </span>
              </div>

              {/* View Full Dossier & CNIC Certificate Button */}
              {(result.type === 'admin' || result.type === 'super_admin' || result.type === 'bd') && (
                <button
                  onClick={() => {
                    onClose();
                    setDossierTargetAppId(result.data.appId);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-blue-500/20 hover:from-amber-500/40 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg"
                >
                  <Link className="w-4 h-4" />
                  <span>{isRomanUrdu ? '🔗 Mukammal Appointment Card & CNIC Dossier Kholein' : '🔗 Open Full Appointment Card & CNIC Dossier'}</span>
                </button>
              )}
            </div>
          ) : (
            /* Warning Scammer Card */
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 shadow-2xl shadow-rose-950 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg">
                  <ShieldAlert className="w-9 h-9" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-black tracking-widest text-rose-400">
                      ⚠️ SCAM WARNING / NOT VERIFIED
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white mt-0.5">
                    ID "{lastSearched}" is NOT an Official Staff Member!
                  </h3>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-rose-900/40 rounded-2xl p-5 space-y-3 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-rose-300 text-sm">
                  {isRomanUrdu ? 'Khabardar rahein! Fraud se bachein:' : 'Security Alert: Risk of Impersonation Fraud!'}
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-300">
                  <li>
                    {isRomanUrdu 
                      ? 'Yeh banda na to Official Super Admin ha, na Admin, na CS aur na hi Coin Reseller!' 
                      : 'This ID has NO admin credentials or registered coin reseller authorization.'}
                  </li>
                  <li>
                    {isRomanUrdu 
                      ? 'In ko kisi qism ke paise, JazzCash, Easypaisa ya Binance USDT transfer NA karein.' 
                      : 'Do NOT send money or crypto to this account under any circumstances.'}
                  </li>
                  <li>
                    {isRomanUrdu 
                      ? 'Official staff kabhi bhi aap se account ka password ya OTP nahi mangta.' 
                      : 'Official Voice App staff will never ask for your account password or OTP.'}
                  </li>
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setInputVal('');
                    setLastSearched('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {isRomanUrdu ? 'Kisi aur ID ko check karein' : 'Verify Another ID'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
