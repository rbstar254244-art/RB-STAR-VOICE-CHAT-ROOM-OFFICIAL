import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Agency, HostMember } from '../types';
import { 
  Building2, 
  Users, 
  Sparkles, 
  Plus, 
  DollarSign, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Calculator,
  ChevronDown,
  ChevronRight,
  Radio
} from 'lucide-react';

interface AgencyPortalViewProps {
  onOpenPasswordModal: () => void;
}

export const AgencyPortalView: React.FC<AgencyPortalViewProps> = ({ onOpenPasswordModal }) => {
  const { 
    agencies, 
    addAgency, 
    addHostToAgency, 
    isUnlocked
  } = useApp();

  const [selectedAgencyId, setSelectedAgencyId] = useState<string>(agencies[0]?.id || '');
  const [showAddAgencyModal, setShowAddAgencyModal] = useState(false);
  const [showAddHostModal, setShowAddHostModal] = useState(false);

  // New Agency state
  const [agencyName, setAgencyName] = useState('');
  const [agencyCode, setAgencyCode] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerAppId, setOwnerAppId] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [commissionPercent, setCommissionPercent] = useState<number>(18);

  // New Host state
  const [hostName, setHostName] = useState('');
  const [hostAppId, setHostAppId] = useState('');
  const [hostGender, setHostGender] = useState<'female' | 'male'>('female');

  // Calculator State
  const [calcDiamonds, setCalcDiamonds] = useState<number>(1000000); // 1 Million default
  const [calcCurrency, setCalcCurrency] = useState<'PKR' | 'USD' | 'INR'>('PKR');

  const selectedAgency = agencies.find(a => a.id === selectedAgencyId) || agencies[0];

  // Conversion rates: 1,000,000 Diamonds = $100 USD approx, 28,000 PKR approx
  const calculateCash = (diamonds: number, cur: 'PKR' | 'USD' | 'INR') => {
    const usd = (diamonds / 10000) * 1.0; // 100 diamonds = $0.01 -> 1M diamonds = $100
    if (cur === 'USD') return usd.toFixed(2);
    if (cur === 'PKR') return (usd * 280).toLocaleString();
    return (usd * 86).toLocaleString();
  };

  const handleCreateAgency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnlocked) {
      onOpenPasswordModal();
      return;
    }

    addAgency({
      agencyName: agencyName.trim(),
      agencyCode: agencyCode.trim().toUpperCase(),
      ownerName: ownerName.trim(),
      ownerAppId: ownerAppId.trim(),
      contactWhatsapp: contactWhatsapp.trim(),
      country,
      commissionPercent: Number(commissionPercent),
      targetHours: 1200,
      status: 'active'
    });

    setShowAddAgencyModal(false);
    setAgencyName('');
    setAgencyCode('');
    setOwnerName('');
    setOwnerAppId('');
    setContactWhatsapp('');
  };

  const handleAddHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgency || !hostAppId.trim()) return;

    addHostToAgency(selectedAgency.id, {
      name: hostName.trim() || `Host_${hostAppId.trim()}`,
      appId: hostAppId.trim(),
      avatar: hostGender === 'female' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' 
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      gender: hostGender
    });

    setShowAddHostModal(false);
    setHostName('');
    setHostAppId('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950 border border-teal-800/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black uppercase flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>OFFICIAL TALENT AGENCY & HOST MANAGEMENT</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Host Salary Settlement
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
            Voice Talent Agencies & Broadcaster Desk
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Direct oversight for licensed agencies, host live performance audits, diamond conversions, and salary remittances.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isUnlocked) onOpenPasswordModal();
            else setShowAddAgencyModal(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-teal-950 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Register Agency</span>
        </button>
      </div>

      {/* Calculator Banner: Diamond to Cash Converter */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-amber-900/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Calculator className="w-5 h-5" />
          <h3 className="font-bold text-white text-sm">
            Diamond to Real Cash Salary Calculator
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2">
            <label className="block text-[11px] text-slate-400 mb-1">Enter Diamonds Amount (e.g. 10 Lakh / 1 Million):</label>
            <input
              type="number"
              value={calcDiamonds}
              onChange={(e) => setCalcDiamonds(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">Currency:</label>
            <div className="flex gap-1.5">
              {(['PKR', 'USD', 'INR'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCalcCurrency(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    calcCurrency === c ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 block uppercase">Host Estimated Salary:</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {calcCurrency} {calculateCash(calcDiamonds, calcCurrency)}
            </span>
          </div>
        </div>
      </div>

      {/* Agencies Navigation Bar or Empty State */}
      {agencies.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 p-8 space-y-4">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">
            No Agencies Registered Yet
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Registered agencies and their talent broadcasters will appear here once added.
          </p>
          <button
            onClick={() => {
              if (!isUnlocked) onOpenPasswordModal();
              else setShowAddAgencyModal(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition shadow-lg shadow-teal-950 cursor-pointer"
          >
            + Register First Agency
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {agencies.map(ag => {
              const isSelected = selectedAgency?.id === ag.id;
              return (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgencyId(ag.id)}
                  className={`p-3 rounded-2xl border text-left shrink-0 transition cursor-pointer min-w-[200px] ${
                    isSelected 
                      ? 'bg-teal-950/70 border-teal-500 shadow-lg shadow-teal-950' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-teal-400">{ag.agencyCode}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded-full">
                      {ag.totalHosts} Hosts
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs mt-1 truncate">{ag.agencyName}</div>
                  <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                    {(ag.monthlyDiamonds / 1000000).toFixed(1)}M Diamonds
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Agency Overview & Host Roster */}
          {selectedAgency && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          {/* Agency Details Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-teal-400 bg-teal-500/20 px-2.5 py-0.5 rounded border border-teal-500/40">
                  {selectedAgency.agencyCode}
                </span>
                <span className="text-xs text-slate-400">{selectedAgency.country}</span>
              </div>
              <h2 className="text-xl font-black text-white mt-1">{selectedAgency.agencyName}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Agency Owner: <strong className="text-slate-200">{selectedAgency.ownerName}</strong> (App ID: <span className="text-purple-300 font-mono">{selectedAgency.ownerAppId}</span>)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${selectedAgency.contactWhatsapp.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(selectedAgency.ownerName)},%20Voice%20App%20Headquarters%20se%20rabta%20kiya%20ha.`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Agency WhatsApp</span>
              </a>

              <button
                onClick={() => setShowAddHostModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-teal-950 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Host</span>
              </button>
            </div>
          </div>

          {/* Agency Monthly Performance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Broadcasters:</span>
              <span className="text-base font-black text-white font-mono mt-0.5 block">
                {selectedAgency.totalHosts} Verified Hosts
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Monthly Diamonds:</span>
              <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                {selectedAgency.monthlyDiamonds.toLocaleString()} 💎
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Agency Cut / Commission:</span>
              <span className="text-base font-black text-teal-400 font-mono mt-0.5 block">
                {selectedAgency.commissionPercent}% Tier
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target Streaming Hours:</span>
              <span className="text-base font-black text-purple-300 font-mono mt-0.5 block">
                {selectedAgency.targetHours} Hours / Month
              </span>
            </div>
          </div>

          {/* Host Roster Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              <span>Broadcaster Host Roster</span>
            </h3>

            {selectedAgency.hosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2.5 font-semibold">Host Broadcaster</th>
                      <th className="pb-2.5 font-semibold">App ID</th>
                      <th className="pb-2.5 font-semibold">Live Hours (This Month)</th>
                      <th className="pb-2.5 font-semibold">Diamonds Earned</th>
                      <th className="pb-2.5 font-semibold">Est. Salary (PKR)</th>
                      <th className="pb-2.5 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedAgency.hosts.map(host => (
                      <tr key={host.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 flex items-center gap-2.5">
                          <img 
                            src={host.avatar} 
                            alt={host.name}
                            className="w-8 h-8 rounded-full object-cover border border-purple-500/40" 
                          />
                          <div>
                            <span className="font-bold text-white text-xs">{host.name}</span>
                            <span className="text-[10px] text-slate-400 block capitalize">{host.gender}</span>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-purple-300 font-bold">{host.appId}</td>
                        <td className="py-3 text-slate-200 font-mono font-semibold">
                          <Clock className="w-3 h-3 inline mr-1 text-slate-400" />
                          {host.liveHoursThisMonth}h / 40h target
                        </td>
                        <td className="py-3 font-mono font-bold text-amber-400">
                          {host.diamondsEarned.toLocaleString()} 💎
                        </td>
                        <td className="py-3 font-mono text-emerald-400 font-bold">
                          Rs {calculateCash(host.diamondsEarned, 'PKR')}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                            host.status === 'live' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {host.status === 'live' ? '🔴 LIVE ON MIC' : 'OFFLINE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-500 text-xs">
                No hosts added to this agency yet. Click "+ Add Host" to onboard broadcasters!
              </div>
            )}
          </div>
        </div>
      )}
      </>
    )}

      {/* Register Agency Modal */}
      {showAddAgencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-400" />
                <span>Register New Talent Agency</span>
              </h3>
              <button onClick={() => setShowAddAgencyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAgency} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Agency Name:</label>
                <input
                  type="text"
                  required
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. Royal Voice Media Group"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Agency Code:</label>
                  <input
                    type="text"
                    required
                    value={agencyCode}
                    onChange={(e) => setAgencyCode(e.target.value)}
                    placeholder="e.g. AG-552"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country:</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Pakistan, UAE"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Owner Name:</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Malik Arshad"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Owner App ID:</label>
                  <input
                    type="text"
                    required
                    value={ownerAppId}
                    onChange={(e) => setOwnerAppId(e.target.value)}
                    placeholder="e.g. 200150"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Contact:</label>
                  <input
                    type="text"
                    required
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    placeholder="+923112486463"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Commission %:</label>
                  <input
                    type="number"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAgencyModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold shadow-lg shadow-teal-950 cursor-pointer"
                >
                  Register Agency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Host Modal */}
      {showAddHostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <span>Add Broadcaster Host</span>
              </h3>
              <button onClick={() => setShowAddHostModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddHost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Host App ID:</label>
                <input
                  type="text"
                  required
                  value={hostAppId}
                  onChange={(e) => setHostAppId(e.target.value)}
                  placeholder="e.g. 542109"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Host Nickname / Stage Name:</label>
                <input
                  type="text"
                  required
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Zara Voice Queen"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender:</label>
                <select
                  value={hostGender}
                  onChange={(e) => setHostGender(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="female">Female Host</option>
                  <option value="male">Male Host</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddHostModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold shadow cursor-pointer"
                >
                  Onboard Host
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
