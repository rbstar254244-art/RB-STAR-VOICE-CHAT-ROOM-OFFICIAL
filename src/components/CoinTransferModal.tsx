import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CoinReseller, CoinTransaction } from '../types';
import { 
  Coins, 
  CheckCircle2, 
  Receipt, 
  X, 
  ArrowRight, 
  Printer, 
  Share2, 
  Sparkles,
  ShieldCheck,
  Lock
} from 'lucide-react';

interface CoinTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedReseller?: CoinReseller;
}

export const CoinTransferModal: React.FC<CoinTransferModalProps> = ({
  isOpen,
  onClose,
  preselectedReseller
}) => {
  const { 
    coinResellers, 
    coinPackages, 
    createCoinTransfer, 
    isUnlocked, 
    isRomanUrdu 
  } = useApp();

  const [resellerId, setResellerId] = useState(preselectedReseller?.id || coinResellers[0]?.id || '');
  const [buyerAppId, setBuyerAppId] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [selectedPkgId, setSelectedPkgId] = useState<string>('pkg-2');
  const [customCoins, setCustomCoins] = useState<number>(50000);
  const [customBonus, setCustomBonus] = useState<number>(3500);
  const [paymentMethod, setPaymentMethod] = useState('JazzCash');
  const [currency, setCurrency] = useState('PKR');
  const [totalPaid, setTotalPaid] = useState<number>(1700);

  const [receipt, setReceipt] = useState<CoinTransaction | null>(null);

  if (!isOpen) return null;

  const currentReseller = coinResellers.find(r => r.id === resellerId);

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    const pkg = coinPackages.find(p => p.id === pkgId);
    if (pkg) {
      setCustomCoins(pkg.coins);
      setCustomBonus(pkg.bonusCoins);
      if (currency === 'PKR') setTotalPaid(pkg.pricePKR);
      else if (currency === 'INR') setTotalPaid(pkg.priceINR);
      else setTotalPaid(pkg.priceUSD);
    }
  };

  const handleCurrencyChange = (newCur: string) => {
    setCurrency(newCur);
    const pkg = coinPackages.find(p => p.id === selectedPkgId);
    if (pkg) {
      if (newCur === 'PKR') setTotalPaid(pkg.pricePKR);
      else if (newCur === 'INR') setTotalPaid(pkg.priceINR);
      else setTotalPaid(pkg.priceUSD);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerAppId.trim()) return;

    const tx = createCoinTransfer({
      resellerId,
      buyerAppId: buyerAppId.trim(),
      buyerName: buyerName.trim() || `User_${buyerAppId.trim()}`,
      coinsAmount: customCoins,
      bonusAmount: customBonus,
      totalPaid,
      currency,
      paymentMethod
    });

    setReceipt(tx);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden relative">
        <button 
          onClick={() => { setReceipt(null); onClose(); }}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {receipt ? (
          /* Official Printable Receipt View */
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-white">
                {isRomanUrdu ? 'Coin Transfer Kamiyab!' : 'Coin Transfer Completed'}
              </h2>
              <p className="text-xs text-emerald-400 font-medium">
                Official In-App Verification Stamp Generated
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-6 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-2 rotate-12 bg-amber-500 text-slate-950 text-[10px] font-black px-8 py-1 uppercase tracking-wider shadow">
                RB STAR VERIFIED
              </div>

              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <img 
                  src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg" 
                  alt="RB STAR" 
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shrink-0" 
                />
                <div className="flex-1">
                  <span className="text-xs font-black text-white block">RB STAR Voice Chat Room</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Official In-App Coin Top-Up Receipt</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-mono text-slate-500 block">Receipt ID</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{receipt.receiptNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Authorized Reseller:</span>
                  <span className="text-slate-200 font-bold">{receipt.resellerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Buyer App ID:</span>
                  <span className="text-purple-400 font-mono font-bold text-sm">{receipt.buyerAppId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Buyer Nickname:</span>
                  <span className="text-slate-200 font-medium">{receipt.buyerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Payment Method:</span>
                  <span className="text-slate-200 font-medium">{receipt.paymentMethod}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Base Voice Coins:</span>
                  <span className="font-mono font-bold text-white">{receipt.coinsAmount.toLocaleString()}</span>
                </div>
                {receipt.bonusAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                    <span>VIP Extra Bonus Coins:</span>
                    <span className="font-mono">+{receipt.bonusAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-slate-800 pt-2 flex justify-between text-sm font-black text-amber-400">
                  <span>Total Coins Credited:</span>
                  <span className="text-base font-mono">
                    {(receipt.coinsAmount + receipt.bonusAmount).toLocaleString()} 🪙
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {receipt.currency} {receipt.totalPaid.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Valid receipt guaranteed by VoiceRoom Official Security.</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setReceipt(null)}
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
              >
                {isRomanUrdu ? 'Naya Transfer Karein' : 'Make Another Transfer'}
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-amber-950"
              >
                <Printer className="w-4 h-4" />
                <span>{isRomanUrdu ? 'Print / Save Receipt' : 'Print Receipt'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Transfer Coins Form */
          <div className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">
                  {isRomanUrdu ? 'Official Coin Top-Up Portal' : 'Transfer Coins to User ID'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isRomanUrdu ? 'Direct App ID par coins send karein aur receipt generate karein' : 'Send official coins directly to any App ID with automated receipt'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Reseller */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isRomanUrdu ? 'Coin Reseller Select Karein:' : 'Authorized Reseller:'}
                </label>
                <select
                  value={resellerId}
                  onChange={(e) => setResellerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {coinResellers.length === 0 ? (
                    <option value="owner-direct">👑 RB STAR Super Admin (Direct Central Mint)</option>
                  ) : (
                    coinResellers.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.resellerCode}) — Stock: {r.coinsAvailable.toLocaleString()} Coins
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Buyer App ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isRomanUrdu ? 'Receiver App ID (User ID):' : 'Receiver App ID:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerAppId}
                    onChange={(e) => setBuyerAppId(e.target.value)}
                    placeholder="e.g. 984210 or 100001"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isRomanUrdu ? 'User Nickname (Optional):' : 'User Nickname:'}
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Zara Voice Queen"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Package Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    {isRomanUrdu ? 'Coin Package Chuniye:' : 'Select Coin Package:'}
                  </label>
                  {/* Currency Picker */}
                  <div className="flex gap-1 text-[11px]">
                    {['PKR', 'USD', 'INR'].map(cur => (
                      <button
                        type="button"
                        key={cur}
                        onClick={() => handleCurrencyChange(cur)}
                        className={`px-2 py-0.5 rounded cursor-pointer ${
                          currency === cur ? 'bg-amber-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {coinPackages.map(pkg => {
                    const isSelected = selectedPkgId === pkg.id;
                    const price = currency === 'PKR' ? `Rs ${pkg.pricePKR}` : currency === 'INR' ? `₹${pkg.priceINR}` : `$${pkg.priceUSD}`;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => handlePackageSelect(pkg.id)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition relative ${
                          isSelected 
                            ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950' 
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {pkg.badge && (
                          <span className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-[9px] font-black text-slate-950 px-1.5 py-0.2 rounded-full uppercase">
                            {pkg.badge}
                          </span>
                        )}
                        <div className="text-xs font-bold text-white font-mono">
                          {pkg.coins.toLocaleString()}
                        </div>
                        {pkg.bonusCoins > 0 && (
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            +{pkg.bonusCoins.toLocaleString()} bonus
                          </div>
                        )}
                        <div className="text-xs text-amber-400 font-bold mt-1">
                          {price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isRomanUrdu ? 'Payment Method:' : 'Payment Method:'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['JazzCash', 'Easypaisa', 'Bank Transfer', 'Binance USDT', 'UPI (GPay)', 'Apple Pay'].map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPaymentMethod(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                        paymentMethod === m 
                          ? 'bg-purple-600 text-white font-bold' 
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary & Submit */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">TOTAL TO PAY:</span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {currency} {totalPaid.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">WILL RECEIVE:</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    {(customCoins + customBonus).toLocaleString()} Coins
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xl shadow-amber-950 cursor-pointer"
                >
                  <Coins className="w-4 h-4" />
                  <span>{isRomanUrdu ? 'Coins Bhejein & Receipt Banayein' : 'Send Coins & Print Receipt'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
