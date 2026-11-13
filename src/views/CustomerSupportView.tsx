import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SupportTicket } from '../types';
import { 
  Headphones, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  ShieldAlert, 
  UserX, 
  VolumeX, 
  MessageSquare, 
  Plus, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface CustomerSupportViewProps {
  onOpenPasswordModal: () => void;
}

export const CustomerSupportView: React.FC<CustomerSupportViewProps> = ({ onOpenPasswordModal }) => {
  const { 
    tickets, 
    addTicket, 
    updateTicketStatus, 
    adminUsers, 
    isUnlocked, 
    isRomanUrdu 
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // In-app user lookup & penalty sandbox
  const [targetAppId, setTargetAppId] = useState('');
  const [penaltyAction, setPenaltyAction] = useState<string | null>(null);

  // New ticket form
  const [newAppId, setNewAppId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('coin_fraud');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('high');
  const [newDescription, setNewDescription] = useState('');

  const csOfficers = adminUsers.filter(a => a.role === 'cs' || a.role === 'super_admin');

  const filteredTickets = tickets.filter(t => {
    const matchCat = filterCategory === 'all' || t.category === filterCategory;
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchCat && matchStatus;
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    updateTicketStatus(selectedTicket.id, 'resolved', 'Ayesha Khan (Head of CS)');
    setReplyMessage('');
    alert(isRomanUrdu ? 'CS jawab user ko in-app notification ke zariye bhej diya gaya!' : 'CS response dispatched to user inbox!');
  };

  const handleApplyPenalty = (type: 'mute_24h' | 'ban_account' | 'device_flag') => {
    if (!targetAppId.trim()) {
      alert(isRomanUrdu ? 'Pehle User App ID likhein!' : 'Enter target user App ID first!');
      return;
    }
    setPenaltyAction(type);
    setTimeout(() => {
      alert(
        isRomanUrdu 
          ? `User ID ${targetAppId} par penalty apply ho chuki ha! Voice Server synced.` 
          : `Action successfully executed on App ID ${targetAppId}. Synchronized with voice gateway.`
      );
      setPenaltyAction(null);
    }, 800);
  };

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTicket({
      userAppId: newAppId.trim(),
      userName: newUserName.trim() || `User_${newAppId.trim()}`,
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'open',
      description: newDescription.trim()
    });

    setShowNewTicketModal(false);
    setNewAppId('');
    setNewUserName('');
    setNewSubject('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950 border border-rose-800/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5" />
              <span>24/7 CUSTOMER SUPPORT & CS HELPDESK</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Live Response System
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
            {isRomanUrdu ? 'Official CS Support & Anti-Fraud Center' : 'Customer Support & Room Dispute Desk'}
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            {isRomanUrdu 
              ? 'Coin fraud shikayaat, fake resellers ki reporting, room mic harassment, aur account ban appeals ka foran faisla karein.'
              : 'Direct resolution engine for top-up delays, coin dispute investigations, mic muting, and account penalties.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href="https://wa.me/923112486463?text=Assalam%20o%20Alaikum%20RB%20STAR%20Support,%20mujhe%20urgent%20help%20chahiye."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>WhatsApp: +92 311 2486463</span>
          </a>

          <button
            onClick={() => setShowNewTicketModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-950 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isRomanUrdu ? '+ Nayi CS Ticket Banayein' : '+ File Support Ticket'}</span>
          </button>
        </div>
      </div>

      {/* Row: In-App User Penalty Tool */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {isRomanUrdu ? 'Live In-App User Quick Moderation & Ban Tool' : 'Instant In-App Moderation & Penalty Engine'}
              </h3>
              <p className="text-xs text-slate-400">
                {isRomanUrdu ? 'Direct App ID daal kar voice room mic mute ya account ban karein' : 'Apply live server-side penalties to any disruptive user'}
              </p>
            </div>
          </div>

          {/* Input & Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Enter User App ID (e.g. 984210)..."
              value={targetAppId}
              onChange={(e) => setTargetAppId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-rose-500 w-44"
            />
            <button
              onClick={() => handleApplyPenalty('mute_24h')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Mute 24h</span>
            </button>
            <button
              onClick={() => handleApplyPenalty('ban_account')}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Ban Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Ticket Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Tickets List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">
              {isRomanUrdu ? 'Shikayaat Ki List' : 'Tickets Inbox'} ({filteredTickets.length})
            </h3>
            
            {/* Status filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                <p>{isRomanUrdu ? 'Abhi koi support ticket nahi hai.' : 'No support tickets.'}</p>
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold cursor-pointer"
                >
                  {isRomanUrdu ? '+ Ticket Darj Karein' : '+ Create Ticket'}
                </button>
              </div>
            ) : (
              filteredTickets.map(ticket => {
              const isSelected = selectedTicket?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                    isSelected 
                      ? 'bg-purple-950/60 border-purple-500 shadow-md shadow-purple-950' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-amber-400">{ticket.ticketNumber}</span>
                    <span className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                      ticket.priority === 'urgent' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs mt-1 truncate">{ticket.subject}</h4>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span>User: <strong className="text-slate-200">{ticket.userName}</strong></span>
                    <span className="font-mono text-purple-300">ID: {ticket.userAppId}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1.5 border-t border-slate-800/80">
                    <span>{ticket.createdAt}</span>
                    <span className={`font-semibold ${ticket.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right: Selected Ticket Detail & Action */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          {selectedTicket ? (
            <div className="space-y-5">
              {/* Ticket Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      {selectedTicket.ticketNumber}
                    </span>
                    <span className="text-xs text-slate-400 uppercase font-mono">{selectedTicket.category.replace('_', ' ')}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">{selectedTicket.subject}</h2>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateTicketStatus(selectedTicket.id, 'resolved', 'Ayesha Khan')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isRomanUrdu ? 'Hal Kar Diya (Resolve)' : 'Mark Resolved'}</span>
                  </button>
                </div>
              </div>

              {/* User Identity In Ticket */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs">
                <img 
                  src={selectedTicket.userAvatar} 
                  alt={selectedTicket.userName}
                  className="w-10 h-10 rounded-xl object-cover border border-purple-500/40" 
                />
                <div className="flex-1">
                  <div className="font-bold text-white">{selectedTicket.userName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    User App ID: <span className="text-amber-400 font-bold">{selectedTicket.userAppId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">CS Assigned:</span>
                  <span className="text-purple-300 font-bold">{selectedTicket.assignedCsName || 'Ayesha Khan'}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">User Complaint Description:</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* CS Reply Box */}
              <form onSubmit={handleReplySubmit} className="space-y-3 pt-2">
                <label className="block text-xs font-medium text-slate-300">
                  {isRomanUrdu ? 'CS Official Jawab Likh Kar Send Karein:' : 'Dispatch Official Support Response:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={isRomanUrdu ? "e.g. Aap ka complaint check kar liya gaya ha, coins aap ke account ID me credit kar diye gaye hain..." : "Type official resolution response..."}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />

                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">Response will deliver directly to App Notification Center</span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-purple-950 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isRomanUrdu ? 'Jawab Bhejein' : 'Send & Resolve'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs">
              Select a ticket to review
            </div>
          )}
        </div>

      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Headphones className="w-5 h-5 text-rose-400" />
                <span>{isRomanUrdu ? 'Nayi Complaint / CS Ticket Darj Karein' : 'Create Customer Support Ticket'}</span>
              </h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">User App ID:</label>
                  <input
                    type="text"
                    required
                    value={newAppId}
                    onChange={(e) => setNewAppId(e.target.value)}
                    placeholder="e.g. 984210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">User Nickname:</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. King_Shoaib"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject / Issue Title:</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Unverified seller fraud report"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="coin_fraud">Coin Top-up Fraud</option>
                    <option value="ban_appeal">Device / ID Ban Appeal</option>
                    <option value="mic_harassment">Room Mic Harassment</option>
                    <option value="reseller_inquiry">Reseller Dispute</option>
                    <option value="account_issue">Account Recovery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Description & Evidence:</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail the issue, transaction reference, or room number..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-950 cursor-pointer"
                >
                  {isRomanUrdu ? 'Ticket File Karein' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
