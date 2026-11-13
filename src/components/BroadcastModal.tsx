import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Radio, Send, Bell, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ isOpen, onClose }) => {
  const { sendBroadcast, broadcasts, isRomanUrdu } = useApp();
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    sendBroadcast(msg.trim());
    setSent(true);
    setMsg('');
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1200);
  };

  const sampleMessages = [
    '👑 Official Notice: Eid Special VIP Room Battle starts tonight at 10:00 PM!',
    '⚠️ Security Alert: Beware of fake coin sellers. Only deal with verified badges!',
    '🌟 Congratulations to Agency AG-991 for crossing 15 Million Diamonds this week!',
    '🎤 Audio System Maintenance: Scheduled ping optimization completed.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                {isRomanUrdu ? 'Official RB STAR App System Broadcast' : 'RB STAR Global App Broadcast'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRomanUrdu ? 'Tamam App users aur official staff ko live system announcement bhejein' : 'Send an official system banner announcement across the RB STAR App ecosystem'}
              </p>
            </div>
          </div>

          {sent ? (
            <div className="p-6 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">
                {isRomanUrdu ? 'Official Notice Foran Dispatch Ho Gaya!' : 'Broadcast Successfully Dispatched!'}
              </h3>
              <p className="text-xs text-emerald-300">
                Pushed to all active app users and staff.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {isRomanUrdu ? 'Message Likhein:' : 'Announcement Message:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder={isRomanUrdu ? "e.g. 📢 Tamam users dhyan dein, official coin rate update ho chuka ha..." : "Type broadcast message..."}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">
                  {isRomanUrdu ? 'Sample Templates:' : 'Quick Templates:'}
                </span>
                <div className="space-y-1.5">
                  {sampleMessages.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMsg(s)}
                      className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800/80 transition cursor-pointer truncate"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isRomanUrdu ? 'Sab Rooms Ko Send Karein' : 'Dispatch Broadcast'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Recent Broadcasts */}
          {broadcasts.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Recent Broadcasts
              </span>
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {broadcasts.map(b => (
                  <div key={b.id} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs">
                    <p className="text-slate-200">{b.message}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>By: {b.sender}</span>
                      <span>{b.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
