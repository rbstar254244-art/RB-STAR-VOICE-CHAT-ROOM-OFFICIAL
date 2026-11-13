import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FreeCoinGrant } from '../types';
import { 
  Sparkles, 
  Coins, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Copy, 
  Trash2, 
  Flame, 
  Gift, 
  Award, 
  Zap, 
  FileText, 
  Printer, 
  X,
  Clock,
  UserCheck
} from 'lucide-react';

export const FreeCoinsView: React.FC = () => {
  const { 
    freeCoinGrants, 
    totalFreeCoinsMinted, 
    mintFreeCoins, 
    deleteFreeCoinGrant,
    appConfig 
  } = useApp();

  const [receiverAppId, setReceiverAppId] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [coinsAmount, setCoinsAmount] = useState<number>(1000000);
  const [category, setCategory] = useState<FreeCoinGrant['category']>('owner_unlimited_mint');
  const [notes, setNotes] = useState('');
  
  const [isMinting, setIsMinting] = useState(false);
  const [recentGrant, setRecentGrant] = useState<FreeCoinGrant | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const quickPresets = [
    { label: '100K Coins', amount: 100000, tag: 'Starter' },
    { label: '500K Coins', amount: 500000, tag: 'Popular' },
    { label: '1 Million', amount: 1000000, tag: 'VIP Gift' },
    { label: '5 Million', amount: 5000000, tag: 'Event Pool' },
    { label: '10 Million', amount: 10000000, tag: 'Mega Reward' },
    { label: '50 Million', amount: 50000000, tag: 'Crown Whale' },
    { label: '100 Million', amount: 100000000, tag: 'Unlimited Max' },
  ];

  const handleMintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverAppId.trim()) return;
    if (coinsAmount <= 0) return;

    setIsMinting(true);
    setTimeout(() => {
      const grant = mintFreeCoins({
        receiverAppId: receiverAppId.trim(),
        receiverName: receiverName.trim() || undefined,
        coinsAmount: Number(coinsAmount),
        category,
        notes: notes.trim() || undefined
      });
      setIsMinting(false);
      setRecentGrant(grant);
      setNotes('');
    }, 400);
  };

  const handleInstantPresetMint = (presetAmount: number) => {
    const targetId = receiverAppId.trim() || '888888';
    setIsMinting(true);
    setTimeout(() => {
      const grant = mintFreeCoins({
        receiverAppId: targetId,
        receiverName: receiverName.trim() || `Owner Vault Recipient`,
        coinsAmount: presetAmount,
        category: 'owner_unlimited_mint',
        notes: `Quick 1-Click Mint of ${presetAmount.toLocaleString()} Free Coins`
      });
      setIsMinting(false);
      setRecentGrant(grant);
    }, 300);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const filteredGrants = freeCoinGrants.filter(g => {
    const matchesSearch = 
      g.receiverAppId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.grantCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || g.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero / Treasury Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-purple-950/70 border border-amber-500/40 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Unlimited Free Coins Vault
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Zero Cost • 100% Free Owner Allocation
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Separated From Paid Reseller Packages
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
              {appConfig.appName} Free Coins Mint
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Generate and grant unlimited free coins directly to any App ID with zero cost. This treasury is completely separated from paid reseller rates, allowing the owner to mint any amount anytime.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/50 rounded-2xl p-5 shrink-0 flex flex-col items-center justify-center text-center shadow-xl">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Coins className="w-4 h-4" />
              Total Free Coins Minted
            </div>
            <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">
              {totalFreeCoinsMinted.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>{freeCoinGrants.length} Official Grants Issued</span>
            </div>
          </div>
        </div>

        {/* 1-Click Fast Mint Row */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              1-Click Instant Mint Presets (Quick Claim)
            </h3>
            <span className="text-[11px] text-slate-400">Target ID: {receiverAppId.trim() || 'Default 888888'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleInstantPresetMint(preset.amount)}
                disabled={isMinting}
                className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/60 transition shadow hover:shadow-amber-950/50 cursor-pointer disabled:opacity-50"
              >
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-300 transition">
                  {preset.tag}
                </span>
                <span className="text-sm font-black text-white group-hover:text-amber-200 transition">
                  +{preset.label}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono mt-0.5 font-bold">
                  $0.00 Free
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Custom Mint Form & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Minting Form (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Custom Free Coins Generator</h2>
                <p className="text-xs text-slate-400">Mint any amount to any verified or custom App ID</p>
              </div>
            </div>

            <form onSubmit={handleMintSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Receiver In-App ID <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={receiverAppId}
                    onChange={(e) => setReceiverAppId(e.target.value)}
                    placeholder="Enter App ID (e.g. 100201 or 992811)"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                  />
                  <UserCheck className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Receiver Name <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  placeholder="e.g. Official Room Host, VIP User, or Friend"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Free Coin Amount <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-xs text-emerald-400 font-bold">Cost: $0.00 / FREE</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="9999999999"
                    required
                    value={coinsAmount || ''}
                    onChange={(e) => setCoinsAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-amber-300 font-mono font-bold focus:outline-none transition"
                  />
                  <Coins className="w-4 h-4 text-amber-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Preview: <span className="text-amber-300 font-mono font-bold">{coinsAmount.toLocaleString()}</span> Free Coins
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Grant Purpose & Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition cursor-pointer"
                >
                  <option value="owner_unlimited_mint">Owner Unlimited Mint (Direct Allocation)</option>
                  <option value="host_bonus">Host Salary Bonus & Live Support</option>
                  <option value="vip_reward">VIP Member Loyalty Reward</option>
                  <option value="event_giveaway">Live Room Event / PK Battle Giveaway</option>
                  <option value="custom_grant">Custom Community Grant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Grant Note / Memo <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Free gift for top room host or weekend party giveaway"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Zero cost summary alert */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-bold text-amber-300 block mb-0.5">Owner Privilege Active</span>
                  You can mint as many free coins as needed. No money will be deducted and reseller stock remains unaffected.
                </div>
              </div>

              <button
                type="submit"
                disabled={isMinting || !receiverAppId.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isMinting ? (
                  <span>Minting Free Coins...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Mint {coinsAmount.toLocaleString()} Free Coins Now</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Free Coins History & Ledger (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  Free Coins Minting Ledger
                </h2>
                <p className="text-xs text-slate-400">Complete record of all free coins generated and delivered</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search ID or voucher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="owner_unlimited_mint">Owner Unlimited</option>
                  <option value="host_bonus">Host Bonus</option>
                  <option value="vip_reward">VIP Reward</option>
                  <option value="event_giveaway">Event Giveaway</option>
                </select>
              </div>
            </div>

            {filteredGrants.length === 0 ? (
              <div className="py-14 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <Coins className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">No Free Coin Grants Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Use the 1-Click buttons above or the custom mint form to create free coin allocations for your voice room users.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredGrants.map((grant) => (
                  <div
                    key={grant.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {grant.grantCode}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                          100% Free
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium capitalize">
                          {grant.category.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="font-bold text-white">App ID: {grant.receiverAppId}</span>
                        <span>•</span>
                        <span className="text-slate-400">{grant.receiverName}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>{grant.timestamp}</span>
                        {grant.notes && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400 italic">"{grant.notes}"</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <div className="text-base sm:text-lg font-black text-amber-300 font-mono">
                        +{grant.coinsAmount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setRecentGrant(grant)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition cursor-pointer flex items-center gap-1"
                          title="View Certificate"
                        >
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span>Receipt</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFreeCoinGrant(grant.id)}
                          className="p-1 rounded-lg hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Grant Certificate & Receipt Modal */}
      {recentGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6">
            <button
              onClick={() => setRecentGrant(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-950">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Free Coins Grant Certificate</h3>
              <p className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Delivered Successfully • $0.00 Free Allocation
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3.5 font-mono text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                <span className="text-slate-400">Grant Code</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">{recentGrant.grantCode}</span>
                  <button
                    onClick={() => handleCopyCode(recentGrant.grantCode)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Copy code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Receiver App ID</span>
                <span className="text-white font-bold">{recentGrant.receiverAppId}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Receiver Name</span>
                <span className="text-slate-300">{recentGrant.receiverName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Coins Granted</span>
                <span className="text-lg font-black text-amber-300">
                  +{recentGrant.coinsAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Official Cost</span>
                <span className="text-emerald-400 font-bold">$0.00 / FREE</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Category</span>
                <span className="text-slate-300 capitalize">{recentGrant.category.replace(/_/g, ' ')}</span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-slate-800">
                <span className="text-slate-400">Issued On</span>
                <span className="text-slate-300">{recentGrant.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print Certificate</span>
              </button>
              <button
                type="button"
                onClick={() => setRecentGrant(null)}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
