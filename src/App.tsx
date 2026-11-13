/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp, NavTab } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MasterPasswordModal } from './components/MasterPasswordModal';
import { VerificationModal } from './components/VerificationModal';
import { BroadcastModal } from './components/BroadcastModal';
import { CoinTransferModal } from './components/CoinTransferModal';
import { StaffDossierModal } from './components/StaffDossierModal';
import { StaffOnboardingModal } from './components/StaffOnboardingModal';
import { CoinReseller } from './types';

// Views
import { SuperAdminView } from './views/SuperAdminView';
import { SiteEditorView } from './views/SiteEditorView';
import { CoinResellersView } from './views/CoinResellersView';
import { FreeCoinsView } from './views/FreeCoinsView';
import { AdminStaffView } from './views/AdminStaffView';
import { CustomerSupportView } from './views/CustomerSupportView';
import { BDPortalView } from './views/BDPortalView';
import { AgencyPortalView } from './views/AgencyPortalView';
import { AppConnectView } from './views/AppConnectView';
import { SettingsView } from './views/SettingsView';
import { PublicLandingView } from './views/PublicLandingView';

import { 
  ShieldCheck, 
  Coins, 
  Users, 
  Headphones, 
  Key, 
  Sparkles,
  Lock,
  Unlock,
  Radio,
  CheckCircle2,
  Heart,
  MessageCircle,
  X
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isUnlocked, 
    isRomanUrdu,
    searchQuery,
    setSearchQuery,
    appConfig,
    dossierTargetAppId,
    setDossierTargetAppId,
    onboardingModalOpen,
    setOnboardingModalOpen,
    onboardingTargetRole
  } = useApp();

  // Modals state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordModalMode, setPasswordModalMode] = useState<'unlock' | 'change'>('unlock');
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedResellerForTransfer, setSelectedResellerForTransfer] = useState<CoinReseller | undefined>(undefined);

  const [popupDismissed, setPopupDismissed] = useState(false);

  const handleOpenTransferModal = (reseller?: CoinReseller) => {
    setSelectedResellerForTransfer(reseller);
    setTransferModalOpen(true);
  };

  const handleOpenPasswordModal = (mode: 'unlock' | 'change' = 'unlock') => {
    setPasswordModalMode(mode);
    setPasswordModalOpen(true);
  };

  const getThemeWrapperClass = () => {
    switch (appConfig.theme) {
      case 'cyber_blue':
        return 'bg-[#030712] selection:bg-cyan-500 text-slate-100';
      case 'emerald_gold':
        return 'bg-[#021814] selection:bg-emerald-500 text-slate-100';
      case 'crimson_vip':
        return 'bg-[#150208] selection:bg-rose-500 text-slate-100';
      case 'stealth_dark':
        return 'bg-[#09090b] selection:bg-zinc-500 text-slate-100';
      case 'sunset_amber':
        return 'bg-[#120702] selection:bg-amber-500 text-slate-100';
      case 'royal_purple':
      default:
        return 'bg-slate-950 selection:bg-purple-600 text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeWrapperClass()} flex flex-col font-sans transition-colors duration-500`}>
      {/* Top Navbar */}
      <Navbar 
        onOpenPasswordModal={() => handleOpenPasswordModal(isUnlocked ? 'change' : 'unlock')}
        onOpenVerifyModal={() => setVerifyModalOpen(true)}
        onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {!isUnlocked ? (
          <PublicLandingView 
            onOpenPasswordModal={() => handleOpenPasswordModal('unlock')}
          />
        ) : (
          <>
            {/* Verification Tab shortcut if selected */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/50 rounded-3xl p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-white">
                    Official Staff & Coin Reseller Verification Center
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto">
                    Verify any In-App ID, Agency code, or Reseller credential to prevent fraud and ensure official authenticity.
                  </p>
                  <div>
                    <button
                      onClick={() => setVerifyModalOpen(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-sm font-black transition shadow-xl shadow-emerald-950 cursor-pointer"
                    >
                      Verify ID Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Views */}
            {activeTab === 'overview' && (
              <SuperAdminView 
                onOpenPasswordModal={() => handleOpenPasswordModal('change')}
                onOpenVerifyModal={() => setVerifyModalOpen(true)}
                onOpenBroadcastModal={() => setBroadcastModalOpen(true)}
                onOpenTransferModal={() => handleOpenTransferModal()}
              />
            )}

            {activeTab === 'site_editor' && (
              <SiteEditorView />
            )}

            {activeTab === 'free_coins' && (
              <FreeCoinsView />
            )}

            {activeTab === 'resellers' && (
              <CoinResellersView 
                onOpenTransferModal={handleOpenTransferModal}
                onOpenPasswordModal={() => handleOpenPasswordModal('unlock')}
              />
            )}

            {activeTab === 'admins' && (
              <AdminStaffView 
                onOpenPasswordModal={() => handleOpenPasswordModal('unlock')}
              />
            )}

            {activeTab === 'cs' && (
              <CustomerSupportView 
                onOpenPasswordModal={() => handleOpenPasswordModal('unlock')}
              />
            )}

            {activeTab === 'bd' && (
              <BDPortalView 
                onOpenPasswordModal={() => handleOpenPasswordModal('unlock')}
              />
            )}

            {activeTab === 'agencies' && (
              <AgencyPortalView 
                onOpenPasswordModal={() => handleOpenPasswordModal('unlock')}
              />
            )}

            {activeTab === 'connect' && (
              <AppConnectView />
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                onOpenPasswordModal={() => handleOpenPasswordModal('change')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-xs py-8 px-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg" 
              alt="RB STAR Voice Chat Room" 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400/60 shadow" 
            />
            <div>
              <span className="font-black text-white text-sm block">RB STAR Voice Chat Room</span>
              <span className="text-[11px] text-slate-400">Official Voice Chat Ecosystem & Admin Center</span>
            </div>
          </div>

          {isUnlocked && (
            <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
              <button onClick={() => setActiveTab('resellers')} className="hover:text-amber-400 transition cursor-pointer">Official Coin Resellers</button>
              <button onClick={() => setActiveTab('admins')} className="hover:text-blue-400 transition cursor-pointer">In-App Admins Roster</button>
              <button onClick={() => setActiveTab('cs')} className="hover:text-rose-400 transition cursor-pointer">Customer Support (CS)</button>
              <button onClick={() => setActiveTab('agencies')} className="hover:text-teal-400 transition cursor-pointer">Talent Agencies</button>
              <button onClick={() => setActiveTab('connect')} className="hover:text-cyan-400 transition cursor-pointer">App Webhook API</button>
            </div>
          )}

          {isUnlocked ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 text-[11px]">
              <a 
                href="https://wa.me/923112486463?text=Assalam%20o%20Alaikum%20RB%20STAR%20Support,%20mujhe%20madad%20chahiye."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 hover:text-white font-mono text-xs font-bold transition shadow"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: +92 311 2486463</span>
              </a>
              <div className="text-right text-[11px] text-slate-500">
                <span className="text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Free & Secure</span>
                </span>
                <span>Client Encrypted • Custom Owner Password Protected</span>
              </div>
            </div>
          ) : (
            <div className="text-right text-[11px] text-slate-500">
              <span className="text-purple-400 font-semibold flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official Portal</span>
              </span>
              <span>RB STAR Voice Chat Room • All In-App Rights Reserved</span>
            </div>
          )}
        </div>
      </footer>

      {/* Floating Action Button (FAB) - Official WhatsApp Support (ONLY inside when admin is logged in) */}
      {isUnlocked && (
        <a
          href={`https://wa.me/${(appConfig.supportWhatsApp || '+92 311 2486463').replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(appConfig.appName)}%20Official%20Support`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl shadow-emerald-950/80 border-2 border-emerald-300/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          title={`Chat on WhatsApp (${appConfig.supportWhatsApp || '+92 311 2486463'})`}
        >
          <div className="relative flex items-center justify-center">
            <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-100 leading-tight">
              Live WhatsApp
            </span>
            <span className="text-xs font-mono font-black text-white leading-tight">
              {appConfig.supportWhatsApp || '+92 311 2486463'}
            </span>
          </div>
        </a>
      )}

      {/* Urgent Announcement Modal */}
      {appConfig.popupNotice?.enabled && !popupDismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setPopupDismissed(true)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                {appConfig.popupNotice.badge || 'URGENT NOTICE'}
              </span>
            </div>
            <h3 className="text-xl font-black text-white">{appConfig.popupNotice.title}</h3>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {appConfig.popupNotice.message}
            </p>
            <button
              onClick={() => setPopupDismissed(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs transition cursor-pointer shadow-lg"
            >
              I Understand / Close Announcement
            </button>
          </div>
        </div>
      )}

      {/* Global Interactive Modals */}
      <MasterPasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        defaultMode={passwordModalMode}
      />

      <VerificationModal
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />

      <BroadcastModal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
      />

      <CoinTransferModal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        preselectedReseller={selectedResellerForTransfer}
      />

      {/* Staff CNIC & Photo Dossier Modal */}
      {dossierTargetAppId && (
        <StaffDossierModal
          appId={dossierTargetAppId}
          onClose={() => setDossierTargetAppId(null)}
        />
      )}

      {/* Staff Online Onboarding & Appointment Form Modal */}
      {onboardingModalOpen && (
        <StaffOnboardingModal
          defaultRole={onboardingTargetRole}
          onClose={() => setOnboardingModalOpen(false)}
        />
      )}
    </div>
  );
};

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error?.message || 'Unexpected rendering error' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <h2 className="text-xl font-black text-rose-400">Portal Recovery Mode</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              A temporary rendering error occurred ({this.state.errorMessage}). Click below to clear cached state and reload cleanly.
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.clear();
                  sessionStorage.clear();
                } catch {}
                window.location.reload();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer"
            >
              Reset Cache & Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </AppErrorBoundary>
  );
}
