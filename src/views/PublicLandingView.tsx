import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Crown,
  Sparkles
} from 'lucide-react';

interface AppScreenshot {
  id: string;
  src: string;
  title: string;
  category: string;
  badge: string;
}

const APP_SCREENSHOTS: AppScreenshot[] = [
  {
    id: 'shot-1',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.33_PM__1__cc4e13c3.jpeg',
    title: 'Welcome to RB Star & Star Member Profile',
    category: 'Home & Profile',
    badge: '👑 Official UI'
  },
  {
    id: 'shot-2',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.33_PM_6baa2cd3.jpeg',
    title: '4-Screen Complete App Tour: Audio Rooms, Stage & Live Roses',
    category: 'Full App Tour',
    badge: '⭐ Audio Rooms'
  },
  {
    id: 'shot-3',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.32_PM__1__2caea900.jpeg',
    title: 'Voice Chat Party, Room Seats & 3D Gift Animations',
    category: 'Party & Gifts',
    badge: '🎁 Live Gifts'
  },
  {
    id: 'shot-4',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.32_PM_4de9e7db.jpeg',
    title: 'Live Voice Room & 3D Luxury Sports Car Gift Effect',
    category: 'Live Voice Room',
    badge: '🏎️ 3D Supercar Gift'
  },
  {
    id: 'shot-5',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.31_PM__1__c12204d5.jpeg',
    title: 'Stage Host, Co-Hosts, Audio Waves & 3D Flower Gifts',
    category: 'Mic Stage PK',
    badge: '🌹 Stage PK'
  },
  {
    id: 'shot-6',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.34_PM_5b476677.jpeg',
    title: 'Party Rooms, SVIP Privileges, Coins & Diamonds Wallet',
    category: 'Wallet & SVIP',
    badge: '💎 Coins & VIP'
  },
  {
    id: 'shot-7',
    src: '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.31_PM_0efaea4b.jpeg',
    title: 'Rank No.1 Voice Room, VIP Guests & Rose Sending Animation',
    category: 'Rankings & VIP',
    badge: '🏆 Rank #1 Room'
  }
];

interface PublicLandingViewProps {
  onOpenPasswordModal?: () => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = () => {
  const { appConfig, screenshots } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayScreenshots = screenshots && screenshots.length > 0 ? screenshots : APP_SCREENSHOTS;

  // Pure automated rotation - speed controlled by site customizer
  useEffect(() => {
    if (displayScreenshots.length === 0) return;
    const intervalMs = Math.max(1.5, appConfig.sliderSpeedSeconds || 3.5) * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayScreenshots.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [displayScreenshots.length, appConfig.sliderSpeedSeconds]);

  const activeShot = displayScreenshots[currentIndex] || displayScreenshots[0];

  if (!activeShot) return null;

  const publicCustomSections = (appConfig.customSections || []).filter(s => s.showInPublic);

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-6xl mx-auto select-none pointer-events-none">
      {/* Hero Header Branding */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-purple-950/90 via-slate-900 to-slate-950 border-2 border-purple-800/60 p-6 sm:p-10 shadow-2xl text-center space-y-4">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />

        {/* Crown Logo with Gold/Purple Glow */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-tr from-amber-400 via-purple-500 to-amber-300 shadow-2xl shadow-purple-950/80 mx-auto">
            <img 
              src={appConfig.appLogo || "/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg"} 
              alt={appConfig.appName} 
              className="w-full h-full object-cover rounded-[22px]" 
            />
          </div>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black px-3.5 py-0.5 rounded-full shadow-lg border border-amber-300 font-mono tracking-wider whitespace-nowrap">
            {appConfig.officialBadge || '👑 OFFICIAL'}
          </span>
        </div>

        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black tracking-wider uppercase font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>{appConfig.appName}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300 tracking-tight leading-tight">
            {appConfig.appName}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            {appConfig.heroDescription || 'Official Voice Chat Room In-App Showcase & Live Interface Preview'}
          </p>
        </div>
      </div>

      {/* Featured 100% Automated Screen Showcase */}
      <div className="relative rounded-3xl bg-slate-900/90 border-2 border-purple-600/40 p-4 sm:p-7 shadow-2xl shadow-purple-950/60 overflow-hidden space-y-5">
        {/* Featured Big Showcase Card - Pure Automatic */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col md:flex-row items-center gap-6 p-4 sm:p-6 shadow-inner">
          {/* Main Visual Display */}
          <div className="relative w-full md:w-3/5 flex items-center justify-center min-h-[300px] sm:min-h-[420px] bg-gradient-to-b from-purple-950/30 to-slate-950/80 rounded-xl overflow-hidden p-2">
            <img 
              src={activeShot.src} 
              alt={activeShot.title}
              key={activeShot.id}
              className="max-h-[440px] w-auto max-w-full object-contain rounded-xl shadow-2xl shadow-purple-950 ring-1 ring-purple-500/40 transition-all duration-700 animate-fadeIn"
            />
          </div>

          {/* Details - Hands Free */}
          <div className="w-full md:w-2/5 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
              <Crown className="w-3.5 h-3.5" />
              <span>{activeShot.badge}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {activeShot.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Official RB STAR voice room interface featuring HD mic seats, audio waves, PK battle stages, and luxury animated gifts.
            </p>

            {/* Indicator Dots - Visual Progress Only */}
            <div className="flex items-center justify-start gap-1.5 pt-4">
              {displayScreenshots.map((shot, idx) => (
                <span
                  key={shot.id}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentIndex === idx 
                      ? 'w-8 bg-gradient-to-r from-amber-400 to-purple-500 shadow-md shadow-amber-500/40' 
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Continuous Auto-Moving Marquee Track (Non-Stop Continuous Gliding) - Controlled by appConfig */}
        {appConfig.showMarquee !== false && (
          <div className="space-y-3 pt-3 border-t border-slate-800/80">
            {/* Infinite Marquee Track 1: Moving Smoothly Left */}
            <div className="overflow-hidden relative rounded-2xl py-2">
              <div className="animate-marquee-left flex items-center gap-4">
                {[...displayScreenshots, ...displayScreenshots].map((shot, i) => (
                  <div
                    key={`left-${shot.id}-${i}`}
                    className="w-56 sm:w-64 shrink-0 rounded-2xl bg-slate-950/80 border-2 border-purple-600/30 p-2.5 shadow-lg group relative overflow-hidden"
                  >
                    <div className="h-36 sm:h-40 w-full overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center">
                      <img 
                        src={shot.src} 
                        alt={shot.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="mt-2 text-left">
                      <span className="text-[10px] font-bold text-amber-400 block truncate">
                        {shot.badge}
                      </span>
                      <p className="text-[11px] text-white font-semibold truncate mt-0.5">
                        {shot.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Infinite Marquee Track 2: Moving Smoothly Right */}
            <div className="overflow-hidden relative rounded-2xl py-2">
              <div className="animate-marquee-right flex items-center gap-4">
                {[...displayScreenshots.slice().reverse(), ...displayScreenshots.slice().reverse()].map((shot, i) => (
                  <div
                    key={`right-${shot.id}-${i}`}
                    className="w-56 sm:w-64 shrink-0 rounded-2xl bg-slate-950/80 border-2 border-purple-600/30 p-2.5 shadow-lg group relative overflow-hidden"
                  >
                    <div className="h-36 sm:h-40 w-full overflow-hidden rounded-xl bg-slate-900 flex items-center justify-center">
                      <img 
                        src={shot.src} 
                        alt={shot.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="mt-2 text-left">
                      <span className="text-[10px] font-bold text-purple-300 block truncate">
                        {shot.badge}
                      </span>
                      <p className="text-[11px] text-white font-semibold truncate mt-0.5">
                        {shot.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Public Custom Content Sections (Configured by Owner) */}
      {publicCustomSections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicCustomSections.map(sec => (
            <div key={sec.id} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-left">
              <div className="flex items-center gap-2">
                {sec.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {sec.badge}
                  </span>
                )}
                <span className="text-[10px] text-slate-500 uppercase font-mono">{sec.category || 'Information'}</span>
              </div>
              <h3 className="text-sm font-bold text-white">{sec.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Footer Note */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1 max-w-md mx-auto">
        <p className="text-slate-300 font-medium">
          {appConfig.footerText || 'RB STAR Voice Chat Room Official Ecosystem'}
        </p>
        <p className="text-[11px] text-slate-500">
          {appConfig.footerSubtext || 'Client Encrypted • All In-App Rights Reserved'}
        </p>
      </div>
    </div>
  );
};
