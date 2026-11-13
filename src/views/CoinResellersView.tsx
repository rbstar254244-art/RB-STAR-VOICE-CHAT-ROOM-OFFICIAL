import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CoinReseller } from '../types';
import { 
  Coins, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle, 
  Phone, 
  Plus, 
  Search, 
  Sparkles, 
  Star, 
  TrendingUp, 
  Receipt, 
  ArrowUpRight,
  Filter,
  Trash2,
  Lock
} from 'lucide-react';

interface CoinResellersViewProps {
  onOpenTransferModal: (reseller?: CoinReseller) => void;
  onOpenPasswordModal: () => void;
}

export const CoinResellersView: React.FC<CoinResellersViewProps> = ({
  onOpenTransferModal,
  onOpenPasswordModal
}) => {
  const { 
    coinResellers, 
    addCoinReseller, 
    deleteCoinReseller, 
    coinPackages, 
    transactions,
    isUnlocked, 
    isRomanUrdu 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New reseller form state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newAppId, setNewAppId] = useState('');
  const [newCountry, setNewCountry] = useState('Pakistan');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newCoins, setNewCoins] = useState(10000000);
  const [newPaymentMethods, setNewPaymentMethods] = useState('JazzCash, Easypaisa, Bank Transfer');

  const filteredResellers = coinResellers.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.resellerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.appId.includes(searchTerm);
    const matchCountry = selectedCountry === 'all' || r.country.toLowerCase().includes(selectedCountry.toLowerCase());
    return matchSearch && matchCountry;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUnlocked) {
      onOpenPasswordModal();
      return;
    }

    addCoinReseller({
      name: newName,
      resellerCode: newCode.toUpperCase(),
      appId: newAppId,
      country: newCountry,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      whatsappNumber: newWhatsapp,
      coinsAvailable: Number(newCoins),
      paymentMethods: newPaymentMethods.split(',').map(s => s.trim()),
      status: 'verified_official',
      discountRate: 'Verified In-App Seller'
    });

    setShowAddModal(false);
    setNewName('');
    setNewCode('');
    setNewAppId('');
    setNewWhatsapp('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                <span>Official Voice App Coin Reseller Network</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                100% SCAM-PROTECTED
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white">
              {isRomanUrdu ? 'Official Coin Resellers & Top-up Hub' : 'Authorized Coin Resellers Directory'}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isRomanUrdu 
                ? 'Tamam tasdeeq shuda coin sellers ki list. Yahan se direct WhatsApp par rabta karein ya user ID par direct coins transfer karke official receipt download karein.'
                : 'Direct access to certified coin merchants with verified stock, official exchange rates, and fraud-free transactions.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => onOpenTransferModal()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-950 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>{isRomanUrdu ? 'Coin Transfer & Receipt' : 'Transfer Coins'}</span>
            </button>

            <button
              onClick={() => {
                if (!isUnlocked) {
                  onOpenPasswordModal();
                } else {
                  setShowAddModal(true);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/40 text-xs font-bold transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isRomanUrdu ? '+ Naya Reseller Add Karein' : '+ Add Official Reseller'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Coin Rate Sheet */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isRomanUrdu ? 'Official Coin Rates & VIP Bundles' : 'Official App Coin Rates & Bonus Tiers'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isRomanUrdu ? 'Resellers se lene par extra bonus coins milte hain' : 'Standard and VIP discount tiers verified by Voice App administration'}
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">
            Updated Rates
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {coinPackages.map(pkg => (
            <div 
              key={pkg.id} 
              className="p-4 rounded-2xl bg-slate-950/70 border border-amber-900/30 hover:border-amber-500/60 transition relative overflow-hidden group"
            >
              {pkg.badge && (
                <span className="absolute top-2 right-2 text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full shadow">
                  {pkg.badge}
                </span>
              )}
              <div className="text-xl font-black text-white font-mono">
                {pkg.coins.toLocaleString()}
              </div>
              <div className="text-xs text-emerald-400 font-bold mt-0.5">
                +{pkg.bonusCoins.toLocaleString()} Free Bonus
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>PKR:</span>
                  <span className="font-bold text-amber-400 font-mono">Rs {pkg.pricePKR}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>INR:</span>
                  <span className="font-mono">₹{pkg.priceINR}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>USD:</span>
                  <span className="font-mono">${pkg.priceUSD}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={isRomanUrdu ? "Reseller name ya App ID se search karein..." : "Search reseller name, code, App ID..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 shrink-0">Region:</span>
          {['all', 'Pakistan', 'UAE', 'India', 'Bangladesh'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition shrink-0 cursor-pointer ${
                selectedCountry === c 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Reseller Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResellers.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-slate-900/60 rounded-3xl border border-dashed border-slate-800 p-8 space-y-4">
            <Coins className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isRomanUrdu ? 'Abhi Tak Koi Official Coin Reseller Add Nahi Hua' : 'No Official Coin Resellers Added Yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isRomanUrdu 
                ? 'Aap ne abhi tak kisi ko Coin Reseller nahi banaya. Yahan sirf wohi verified sellers show hon ge jin ko aap khud add karein gay.' 
                : 'Authorized coin sellers with their WhatsApp contact and transfer privileges will be listed here once you register them.'}
            </p>
            <button
              onClick={() => {
                if (!isUnlocked) onOpenPasswordModal();
                else setShowAddModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-950 cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isRomanUrdu ? '+ Naya Reseller Add Karein' : '+ Add Official Reseller'}</span>
            </button>
          </div>
        ) : (
          filteredResellers.map(reseller => (
          <div 
            key={reseller.id} 
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 space-y-4 shadow-xl transition relative group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <img 
                    src={reseller.avatar} 
                    alt={reseller.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md" 
                  />
                  <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{reseller.name}</h3>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Reseller Code: <span className="text-amber-400 font-bold">{reseller.resellerCode}</span>
                    <span className="mx-2 text-slate-600">|</span>
                    App ID: <span className="text-purple-300 font-bold">{reseller.appId}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                    {reseller.discountRate}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{reseller.rating}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  Verified: {reseller.verifiedSince}
                </span>
              </div>
            </div>

            {/* Balances & Stats */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Available Stock:</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {reseller.coinsAvailable.toLocaleString()} 🪙
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase font-medium">Total Coins Sold:</span>
                <span className="text-base font-black text-slate-200 font-mono">
                  {(reseller.totalCoinsSold / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                {isRomanUrdu ? 'Payment Tariqay:' : 'Accepted Payments:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {reseller.paymentMethods.map((pm, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {pm}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/${reseller.whatsappNumber.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(reseller.name)},%20mujhy%20Voice%20Chat%20Room%20app%20ke%20coins%20topup%20karwany%20hain.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Contact</span>
                </a>

                <button
                  onClick={() => onOpenTransferModal(reseller)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>{isRomanUrdu ? 'Coins Bhejein' : 'Transfer'}</span>
                </button>
              </div>

              {isUnlocked && (
                <button
                  onClick={() => deleteCoinReseller(reseller.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  title="Remove Reseller (Owner Only)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )))}
      </div>

      {/* Add New Reseller Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                <span>{isRomanUrdu ? 'Naya Official Coin Reseller Register Karein' : 'Register Official Coin Reseller'}</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Store / Reseller Name:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sultan Coins Official"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Reseller Code:</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CR-PK-05"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">In-App User ID:</label>
                  <input
                    type="text"
                    required
                    value={newAppId}
                    onChange={(e) => setNewAppId(e.target.value)}
                    placeholder="e.g. 777005"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country:</label>
                  <select
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="UAE / GCC">UAE / GCC</option>
                    <option value="India">India</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Bangladesh">Bangladesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp Number:</label>
                  <input
                    type="text"
                    required
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    placeholder="+923112486463"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Initial Coin Stock:</label>
                <input
                  type="number"
                  value={newCoins}
                  onChange={(e) => setNewCoins(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Payment Methods (comma separated):</label>
                <input
                  type="text"
                  value={newPaymentMethods}
                  onChange={(e) => setNewPaymentMethods(e.target.value)}
                  placeholder="JazzCash, Easypaisa, Meezan Bank, Binance USDT"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-950 cursor-pointer"
                >
                  {isRomanUrdu ? 'Reseller Save Karein' : 'Register Reseller'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Coin Transfer Log */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {isRomanUrdu ? 'Haal Hi Me Kiye Gaye Transfers (Receipts)' : 'Recent Coin Top-up Receipts'}
            </h3>
          </div>
          <span className="text-xs text-slate-400">{transactions.length} Total Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5 font-semibold">Receipt Number</th>
                <th className="pb-2.5 font-semibold">Reseller</th>
                <th className="pb-2.5 font-semibold">Buyer App ID</th>
                <th className="pb-2.5 font-semibold">Coins Credited</th>
                <th className="pb-2.5 font-semibold">Amount Paid</th>
                <th className="pb-2.5 font-semibold">Date & Time</th>
                <th className="pb-2.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono text-amber-400 font-bold">{tx.receiptNumber}</td>
                  <td className="py-3 text-slate-200 font-medium">{tx.resellerName}</td>
                  <td className="py-3 font-mono text-purple-300 font-bold">{tx.buyerAppId}</td>
                  <td className="py-3 font-mono font-bold text-emerald-400">
                    {(tx.coinsAmount + tx.bonusAmount).toLocaleString()} 🪙
                  </td>
                  <td className="py-3 text-slate-300 font-mono">
                    {tx.currency} {tx.totalPaid.toLocaleString()} ({tx.paymentMethod})
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">{tx.timestamp}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                      COMPLETED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
