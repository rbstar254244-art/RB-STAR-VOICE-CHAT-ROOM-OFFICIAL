import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CoinPackage, AppScreenshot, WebsiteTheme, TabRenameMap, CustomPageSection } from '../types';
import { 
  Sliders, 
  Coins, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Percent, 
  RefreshCw, 
  CheckCircle2, 
  Image as ImageIcon, 
  Globe, 
  Phone, 
  MessageCircle, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  DollarSign, 
  Save, 
  Eye, 
  X,
  Layers,
  ArrowRight,
  Palette,
  Type,
  FileCode,
  BellRing,
  BookOpen,
  Zap,
  Download,
  Upload,
  Check,
  AlertTriangle
} from 'lucide-react';

export const SiteEditorView: React.FC = () => {
  const { 
    coinPackages, 
    addCoinPackage, 
    updateCoinPackage, 
    deleteCoinPackage, 
    bulkAdjustCoinPrices, 
    resetCoinPackages,
    screenshots,
    addAppScreenshot,
    updateAppScreenshot,
    deleteAppScreenshot,
    resetAppScreenshots,
    appConfig,
    updateAppConfig,
    setWebsiteTheme,
    renameTab,
    resetTabNames,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    setPopupNotice,
    applyFullDatabaseJSON,
    exportDatabaseJSON,
    adminUsers,
    coinResellers,
    voiceRooms,
    agencies,
    bdManagers,
    tickets,
    transactions,
    freeCoinGrants,
    masterPassword
  } = useApp();

  type SubTab = 
    | 'coins' 
    | 'themes' 
    | 'branding' 
    | 'tabs' 
    | 'contacts' 
    | 'screenshots' 
    | 'sections' 
    | 'popup' 
    | 'raw_json';

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('coins');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Branding Form State
  const [appName, setAppName] = useState(appConfig.appName || '');
  const [appSlogan, setAppSlogan] = useState(appConfig.appSlogan || '');
  const [heroDescription, setHeroDescription] = useState(appConfig.heroDescription || '');
  const [tickerText, setTickerText] = useState(appConfig.tickerText || '');
  const [officialBadge, setOfficialBadge] = useState(appConfig.officialBadge || '');
  const [appLogo, setAppLogo] = useState(appConfig.appLogo || '');
  const [footerText, setFooterText] = useState(appConfig.footerText || '');
  const [footerSubtext, setFooterSubtext] = useState(appConfig.footerSubtext || '');

  // Theme & Appearance State
  const [selectedTheme, setSelectedTheme] = useState<WebsiteTheme>(appConfig.theme || 'royal_purple');
  const [sliderSpeed, setSliderSpeed] = useState<number>(appConfig.sliderSpeedSeconds || 3.5);
  const [showMarquee, setShowMarquee] = useState<boolean>(appConfig.showMarquee !== false);
  const [showTicker, setShowTicker] = useState<boolean>(appConfig.showTicker !== false);
  const [diamondRate, setDiamondRate] = useState<number>(appConfig.diamondToUsdRate || 10000);

  // Contact Form State
  const [supportWhatsApp, setSupportWhatsApp] = useState(appConfig.supportWhatsApp || '');
  const [supportTelegram, setSupportTelegram] = useState(appConfig.supportTelegram || '');
  const [supportEmail, setSupportEmail] = useState(appConfig.supportEmail || '');

  // Tab Renaming State
  const [tabRenamesState, setTabRenamesState] = useState<TabRenameMap>(appConfig.tabRenames || {});

  // Popup Notice State
  const [popupEnabled, setPopupEnabled] = useState<boolean>(appConfig.popupNotice?.enabled || false);
  const [popupTitle, setPopupTitle] = useState<string>(appConfig.popupNotice?.title || '📢 Official Announcement');
  const [popupMessage, setPopupMessage] = useState<string>(appConfig.popupNotice?.message || '');
  const [popupBadge, setPopupBadge] = useState<string>(appConfig.popupNotice?.badge || 'URGENT');

  // Bulk Coin Price Adjust State
  const [bulkPercent, setBulkPercent] = useState<number>(10);
  const [bulkCurrency, setBulkCurrency] = useState<'all' | 'PKR' | 'USD' | 'INR'>('all');

  // Add/Edit Package Modal State
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [pkgCoins, setPkgCoins] = useState<number>(100000);
  const [pkgBonus, setPkgBonus] = useState<number>(10000);
  const [pkgPricePKR, setPkgPricePKR] = useState<number>(3500);
  const [pkgPriceUSD, setPkgPriceUSD] = useState<number>(12);
  const [pkgPriceINR, setPkgPriceINR] = useState<number>(1000);
  const [pkgBadge, setPkgBadge] = useState<string>('VIP Choice');

  // Add Screenshot Modal State
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);
  const [editingScreenshotId, setEditingScreenshotId] = useState<string | null>(null);
  const [screenSrc, setScreenSrc] = useState('');
  const [screenTitle, setScreenTitle] = useState('');
  const [screenCategory, setScreenCategory] = useState('Voice Rooms');
  const [screenBadge, setScreenBadge] = useState('⭐ Official UI');

  // Add Custom Section Modal State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [secTitle, setSecTitle] = useState('');
  const [secContent, setSecContent] = useState('');
  const [secBadge, setSecBadge] = useState('📜 Policy');
  const [secCategory, setSecCategory] = useState('Rules');
  const [secPublic, setSecPublic] = useState(true);

  // Raw JSON Live Code Editor State
  const [rawJsonText, setRawJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');

  // Keep state synced when appConfig changes
  useEffect(() => {
    setAppName(appConfig.appName || '');
    setAppSlogan(appConfig.appSlogan || '');
    setHeroDescription(appConfig.heroDescription || '');
    setTickerText(appConfig.tickerText || '');
    setOfficialBadge(appConfig.officialBadge || '');
    setAppLogo(appConfig.appLogo || '');
    setFooterText(appConfig.footerText || '');
    setFooterSubtext(appConfig.footerSubtext || '');
    setSelectedTheme(appConfig.theme || 'royal_purple');
    setSliderSpeed(appConfig.sliderSpeedSeconds || 3.5);
    setShowMarquee(appConfig.showMarquee !== false);
    setShowTicker(appConfig.showTicker !== false);
    setDiamondRate(appConfig.diamondToUsdRate || 10000);
    setSupportWhatsApp(appConfig.supportWhatsApp || '');
    setSupportTelegram(appConfig.supportTelegram || '');
    setSupportEmail(appConfig.supportEmail || '');
    setTabRenamesState(appConfig.tabRenames || {});
    setPopupEnabled(appConfig.popupNotice?.enabled || false);
    setPopupTitle(appConfig.popupNotice?.title || '📢 Official Announcement');
    setPopupMessage(appConfig.popupNotice?.message || '');
    setPopupBadge(appConfig.popupNotice?.badge || 'URGENT');
  }, [appConfig]);

  // Load JSON into raw editor when tab is selected
  useEffect(() => {
    if (activeSubTab === 'raw_json') {
      const fullSnapshot = {
        appConfig,
        coinPackages,
        screenshots,
        adminUsers,
        coinResellers,
        voiceRooms,
        agencies,
        bdManagers,
        tickets,
        transactions,
        freeCoinGrants
      };
      setRawJsonText(JSON.stringify(fullSnapshot, null, 2));
      setJsonError('');
    }
  }, [activeSubTab]);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppConfig({
      appName: appName.trim() || appConfig.appName,
      appSlogan: appSlogan.trim(),
      heroDescription: heroDescription.trim(),
      tickerText: tickerText.trim(),
      officialBadge: officialBadge.trim(),
      appLogo: appLogo.trim() || appConfig.appLogo,
      footerText: footerText.trim(),
      footerSubtext: footerSubtext.trim()
    });
    showNotification('Website identity, title, announcements & footer updated live!');
  };

  const handleSaveThemeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppConfig({
      theme: selectedTheme,
      sliderSpeedSeconds: Number(sliderSpeed) || 3.5,
      showMarquee,
      showTicker,
      diamondToUsdRate: Number(diamondRate) || 10000
    });
    showNotification('Visual theme, slider speed & display settings applied!');
  };

  const handleSaveContacts = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppConfig({
      supportWhatsApp: supportWhatsApp.trim(),
      supportTelegram: supportTelegram.trim(),
      supportEmail: supportEmail.trim()
    });
    showNotification('Official support channels & contact numbers updated live!');
  };

  const handleSaveTabRenames = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppConfig({
      tabRenames: tabRenamesState
    });
    showNotification('Navigation tab titles updated live across the entire navigation bar!');
  };

  const handleSavePopupNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setPopupNotice({
      enabled: popupEnabled,
      title: popupTitle.trim(),
      message: popupMessage.trim(),
      badge: popupBadge.trim()
    });
    showNotification(popupEnabled ? 'Urgent popup announcement activated!' : 'Popup announcement disabled.');
  };

  const handleBulkPriceAdjust = (direction: 'increase' | 'decrease') => {
    const percent = direction === 'increase' ? Math.abs(bulkPercent) : -Math.abs(bulkPercent);
    bulkAdjustCoinPrices(percent, bulkCurrency);
    showNotification(`Coin prices successfully ${direction === 'increase' ? 'increased' : 'discounted'} by ${Math.abs(bulkPercent)}% for ${bulkCurrency.toUpperCase()}!`);
  };

  const openAddPackageModal = () => {
    setEditingPackageId(null);
    setPkgCoins(100000);
    setPkgBonus(10000);
    setPkgPricePKR(3500);
    setPkgPriceUSD(12);
    setPkgPriceINR(1000);
    setPkgBadge('Hot Bundle');
    setIsPackageModalOpen(true);
  };

  const openEditPackageModal = (pkg: CoinPackage) => {
    setEditingPackageId(pkg.id);
    setPkgCoins(pkg.coins);
    setPkgBonus(pkg.bonusCoins);
    setPkgPricePKR(pkg.pricePKR);
    setPkgPriceUSD(pkg.priceUSD);
    setPkgPriceINR(pkg.priceINR);
    setPkgBadge(pkg.badge || '');
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackageId) {
      updateCoinPackage(editingPackageId, {
        coins: Number(pkgCoins),
        bonusCoins: Number(pkgBonus),
        pricePKR: Number(pkgPricePKR),
        priceUSD: Number(pkgPriceUSD),
        priceINR: Number(pkgPriceINR),
        badge: pkgBadge.trim() || undefined
      });
      showNotification('Coin package updated successfully!');
    } else {
      addCoinPackage({
        coins: Number(pkgCoins),
        bonusCoins: Number(pkgBonus),
        pricePKR: Number(pkgPricePKR),
        priceUSD: Number(pkgPriceUSD),
        priceINR: Number(pkgPriceINR),
        badge: pkgBadge.trim() || undefined
      });
      showNotification('New coin package added to store!');
    }
    setIsPackageModalOpen(false);
  };

  const openAddScreenshotModal = () => {
    setEditingScreenshotId(null);
    setScreenSrc('');
    setScreenTitle('');
    setScreenCategory('Voice Rooms');
    setScreenBadge('⭐ Official UI');
    setIsScreenshotModalOpen(true);
  };

  const openEditScreenshotModal = (shot: AppScreenshot) => {
    setEditingScreenshotId(shot.id);
    setScreenSrc(shot.src);
    setScreenTitle(shot.title);
    setScreenCategory(shot.category);
    setScreenBadge(shot.badge);
    setIsScreenshotModalOpen(true);
  };

  const handleSaveScreenshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenSrc.trim() || !screenTitle.trim()) return;

    if (editingScreenshotId) {
      updateAppScreenshot(editingScreenshotId, {
        src: screenSrc.trim(),
        title: screenTitle.trim(),
        category: screenCategory.trim(),
        badge: screenBadge.trim()
      });
      showNotification('Showcase screenshot updated!');
    } else {
      addAppScreenshot({
        src: screenSrc.trim(),
        title: screenTitle.trim(),
        category: screenCategory.trim(),
        badge: screenBadge.trim()
      });
      showNotification('New screenshot added to showcase slider & marquee!');
    }
    setIsScreenshotModalOpen(false);
  };

  const openAddSectionModal = () => {
    setEditingSectionId(null);
    setSecTitle('');
    setSecContent('');
    setSecBadge('📜 Rules');
    setSecCategory('Guidelines');
    setSecPublic(true);
    setIsSectionModalOpen(true);
  };

  const openEditSectionModal = (sec: CustomPageSection) => {
    setEditingSectionId(sec.id);
    setSecTitle(sec.title);
    setSecContent(sec.content);
    setSecBadge(sec.badge || '');
    setSecCategory(sec.category || 'General');
    setSecPublic(sec.showInPublic !== false);
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secTitle.trim() || !secContent.trim()) return;

    if (editingSectionId) {
      updateCustomSection(editingSectionId, {
        title: secTitle.trim(),
        content: secContent.trim(),
        badge: secBadge.trim() || undefined,
        category: secCategory.trim() || undefined,
        showInPublic: secPublic
      });
      showNotification('Custom content section updated!');
    } else {
      addCustomSection({
        title: secTitle.trim(),
        content: secContent.trim(),
        badge: secBadge.trim() || undefined,
        category: secCategory.trim() || undefined,
        showInPublic: secPublic
      });
      showNotification('New custom content section added!');
    }
    setIsSectionModalOpen(false);
  };

  const handleApplyRawJson = () => {
    setJsonError('');
    try {
      const parsed = JSON.parse(rawJsonText);
      const success = applyFullDatabaseJSON(parsed);
      if (success) {
        showNotification('⚡ God-Mode Activated: Full raw database successfully applied live!');
      } else {
        setJsonError('Failed to apply JSON. Please ensure it is a valid object snapshot.');
      }
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const themeOptions: { id: WebsiteTheme; label: string; desc: string; colors: string }[] = [
    { id: 'royal_purple', label: 'Royal Gold & Purple (Official)', desc: 'Imperial purple atmosphere with golden accents and crown styling', colors: 'from-purple-900 via-indigo-900 to-amber-900' },
    { id: 'cyber_blue', label: 'Cyberpunk Neon Blue', desc: 'Electric blue and cyan tech glow with futuristic styling', colors: 'from-cyan-900 via-blue-900 to-indigo-950' },
    { id: 'emerald_gold', label: 'Emerald Empire & Gold', desc: 'Prestigious deep emerald green with rich yellow gold highlights', colors: 'from-emerald-950 via-teal-900 to-amber-950' },
    { id: 'crimson_vip', label: 'Crimson Ruby VIP', desc: 'High-roller deep red and burgundy with bright ruby highlights', colors: 'from-rose-950 via-red-900 to-pink-950' },
    { id: 'stealth_dark', label: 'Midnight Stealth Dark', desc: 'Ultra clean monochrome dark zinc with crisp silver accents', colors: 'from-zinc-900 via-slate-900 to-neutral-950' },
    { id: 'sunset_amber', label: 'Sunset Amber & Orange', desc: 'Warm blazing amber, bronze and golden fire highlights', colors: 'from-amber-950 via-orange-900 to-yellow-950' },
  ];

  const defaultTabLabels: { id: keyof TabRenameMap; defaultLabel: string; desc: string }[] = [
    { id: 'overview', defaultLabel: 'Super Admin', desc: 'Main executive management dashboard' },
    { id: 'site_editor', defaultLabel: 'Site & Prices Editor', desc: 'Full website customization controller' },
    { id: 'free_coins', defaultLabel: 'Free Coins Mint', desc: 'Unlimited owner free coin generator' },
    { id: 'resellers', defaultLabel: 'Coin Resellers', desc: 'Official coin seller directory & rates' },
    { id: 'admins', defaultLabel: 'App Admins & Staff', desc: 'Official verified app administration' },
    { id: 'cs', defaultLabel: 'CS Support', desc: 'Customer support & ticket resolution' },
    { id: 'bd', defaultLabel: 'BD Managers', desc: 'Business development managers' },
    { id: 'agencies', defaultLabel: 'Agencies & Hosts', desc: 'Talent agencies and live streaming hosts' },
    { id: 'verification', defaultLabel: 'Verify Staff ID', desc: 'Public ID verification & fraud checker' },
    { id: 'connect', defaultLabel: 'App Connect API', desc: 'Mobile app webhook & synchronization' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-16 max-w-7xl mx-auto">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-2 border-purple-800/60 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-pink-500/20 text-pink-300 border border-pink-500/40 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                Full Website Master Control Panel
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Instant Modification Active
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Change 100% of Everything
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
              Complete Website Customizer & Manager
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              You have full power to modify everything: Change coin prices & packages, rename any tab, switch themes, customize titles, announcements, support WhatsApp, showcase images, add custom policy pages, or edit raw JSON directly.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={exportDatabaseJSON}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Download full website backup"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 9 Comprehensive Customization Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveSubTab('coins')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'coins'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Coin Pricing ({coinPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('themes')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'themes'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes & Display</span>
          </button>

          <button
            onClick={() => setActiveSubTab('branding')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'branding'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Site Identity & Logo</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tabs')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'tabs'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Rename Tabs</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'contacts'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp & Contacts</span>
          </button>

          <button
            onClick={() => setActiveSubTab('screenshots')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'screenshots'
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Showcase Media ({screenshots.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sections')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sections'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Custom Sections & Rules ({(appConfig.customSections || []).length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('popup')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'popup'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Popup Notice</span>
          </button>

          <button
            onClick={() => setActiveSubTab('raw_json')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeSubTab === 'raw_json'
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-lg'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Raw JSON God-Mode</span>
          </button>
        </div>
      </div>

      {/* 1. COIN PRICING & PACKAGE MANAGER */}
      {activeSubTab === 'coins' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Quick Price Increase & Discount Controller
                </h3>
                <p className="text-xs text-slate-400">
                  Increase or discount coin rates by percentage or customize individual rates in PKR, USD, and INR.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetCoinPackages}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default Prices</span>
                </button>
                <button
                  type="button"
                  onClick={openAddPackageModal}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add New Package</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-400">Currency:</span>
                <select
                  value={bulkCurrency}
                  onChange={(e) => setBulkCurrency(e.target.value as any)}
                  className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="all">All (PKR, USD, INR)</option>
                  <option value="PKR">PKR Only</option>
                  <option value="USD">USD Only</option>
                  <option value="INR">INR Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-400">Percentage:</span>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={bulkPercent}
                  onChange={(e) => setBulkPercent(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-transparent text-xs text-amber-300 font-bold focus:outline-none"
                />
                <span className="text-xs text-slate-400">%</span>
              </div>

              <button
                type="button"
                onClick={() => handleBulkPriceAdjust('increase')}
                className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Increase Prices (+{bulkPercent}%)</span>
              </button>

              <button
                type="button"
                onClick={() => handleBulkPriceAdjust('decrease')}
                className="px-4 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Discount / Reduce (-{bulkPercent}%)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coinPackages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-lg transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono font-bold text-slate-500">#{index + 1}</span>
                    {pkg.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl font-black text-amber-400 font-mono">
                      {pkg.coins.toLocaleString()} Coins
                    </div>
                    {pkg.bonusCoins > 0 && (
                      <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>+{pkg.bonusCoins.toLocaleString()} Bonus Coins Free</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-semibold">Pakistan (PKR):</span>
                      <span className="font-black text-white font-mono text-sm">
                        Rs. {pkg.pricePKR.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-semibold">International (USD):</span>
                      <span className="font-bold text-emerald-300 font-mono">
                        ${pkg.priceUSD.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                      <span className="text-slate-400 font-semibold">India (INR):</span>
                      <span className="font-bold text-cyan-300 font-mono">
                        ₹{pkg.priceINR.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => openEditPackageModal(pkg)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Price</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (coinPackages.length <= 1) {
                        alert('At least one coin package must remain.');
                        return;
                      }
                      deleteCoinPackage(pkg.id);
                      showNotification('Package removed.');
                    }}
                    className="p-2 rounded-xl hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-900 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. THEMES & DISPLAY SETTINGS */}
      {activeSubTab === 'themes' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
              <Palette className="w-5 h-5 text-purple-400" />
              Website Atmosphere & Themes
            </h3>
            <p className="text-xs text-slate-400">
              Select the color atmosphere and customize showcase speed, marquee gliding, and top ticker visibility.
            </p>
          </div>

          <form onSubmit={handleSaveThemeSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {themeOptions.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setSelectedTheme(th.id)}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                    selectedTheme === th.id
                      ? 'border-purple-500 bg-purple-950/40 shadow-xl shadow-purple-950'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className={`h-8 w-full rounded-xl bg-gradient-to-r ${th.colors} mb-2 shadow`} />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{th.label}</span>
                      {selectedTheme === th.id && (
                        <span className="p-1 rounded-full bg-purple-500 text-white">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{th.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Public Slider Speed (Seconds):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1.5"
                    max="15"
                    step="0.5"
                    value={sliderSpeed}
                    onChange={(e) => setSliderSpeed(parseFloat(e.target.value) || 3.5)}
                    className="w-24 bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white font-mono"
                  />
                  <span className="text-xs text-slate-400">seconds per screen</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Continuous Gliding Marquee:
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showMarquee}
                      onChange={(e) => setShowMarquee(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Show double marquee tracks on landing page</span>
                  </label>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  Top Announcement Ticker:
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTicker}
                      onChange={(e) => setShowTicker(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"
                    />
                    <span>Show top moving announcement bar</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Apply Theme & Display Settings</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. WEBSITE BRANDING & IDENTITY */}
      {activeSubTab === 'branding' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSaveBranding} className="space-y-6 max-w-3xl">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                <Globe className="w-5 h-5 text-purple-400" />
                Website Title, Badges & Footers
              </h3>
              <p className="text-xs text-slate-400">
                Change the brand name, official badges, header description, and bottom footer copyrights.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  App / Website Name:
                </label>
                <input
                  type="text"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder="e.g. RB STAR Voice Chat Room"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Official Badge Text:
                </label>
                <input
                  type="text"
                  value={officialBadge}
                  onChange={(e) => setOfficialBadge(e.target.value)}
                  placeholder="e.g. 👑 OFFICIAL or ⭐ VERIFIED"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Top Announcement Ticker (Shown across the whole website):
              </label>
              <input
                type="text"
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                placeholder="e.g. Official Directory for Voice Chat App Admins, Verified Resellers, Agencies & CS"
                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Hero Headline Description:
              </label>
              <textarea
                rows={2}
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="e.g. Official Voice Chat Room In-App Showcase & Live Interface Preview"
                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Footer Copyright Text:
                </label>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="e.g. RB STAR Voice Chat Room Official Ecosystem"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Footer Subtext / Protection Notice:
                </label>
                <input
                  type="text"
                  value={footerSubtext}
                  onChange={(e) => setFooterSubtext(e.target.value)}
                  placeholder="e.g. Client Encrypted • All In-App Rights Reserved"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                App Logo Image URL / Local Asset Path:
              </label>
              <input
                type="text"
                value={appLogo}
                onChange={(e) => setAppLogo(e.target.value)}
                placeholder="/assets/aistudio/... or https://..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Website Identity</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. RENAME NAVIGATION TABS */}
      {activeSubTab === 'tabs' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Type className="w-5 h-5 text-cyan-400" />
                Customize & Rename All Navigation Tabs
              </h3>
              <p className="text-xs text-slate-400">
                You can change the name of any tab on the navigation bar to whatever you want.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetTabNames();
                setTabRenamesState({});
                showNotification('All tab names restored to default!');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default Tab Names</span>
            </button>
          </div>

          <form onSubmit={handleSaveTabRenames} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultTabLabels.map(tab => (
                <div key={tab.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400">Original: <strong className="text-slate-200">{tab.defaultLabel}</strong></span>
                    <span className="text-[10px] text-slate-500 font-mono">id: {tab.id}</span>
                  </div>
                  <input
                    type="text"
                    value={tabRenamesState[tab.id] !== undefined ? tabRenamesState[tab.id] : ''}
                    placeholder={`Custom name for "${tab.defaultLabel}"`}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTabRenamesState(prev => ({
                        ...prev,
                        [tab.id]: val
                      }));
                    }}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">{tab.desc}</p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-950 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All Custom Tab Names</span>
            </button>
          </form>
        </div>
      )}

      {/* 5. SUPPORT & WHATSAPP CONTACTS */}
      {activeSubTab === 'contacts' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSaveContacts} className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                <Phone className="w-5 h-5 text-emerald-400" />
                Official Support Channels & Economy Rates
              </h3>
              <p className="text-xs text-slate-400">
                Update official WhatsApp contacts, Telegram channel, and host diamond payout rates.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                Official WhatsApp Number:
              </label>
              <input
                type="text"
                value={supportWhatsApp}
                onChange={(e) => setSupportWhatsApp(e.target.value)}
                placeholder="+92 311 2486463"
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                Official Telegram Channel / Handle:
              </label>
              <input
                type="text"
                value={supportTelegram}
                onChange={(e) => setSupportTelegram(e.target.value)}
                placeholder="@RBStarOfficial"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-rose-400" />
                Official Support Email:
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@rbstarvoice.com"
                className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Agency Host Diamond Settlement Rate (1 USD = X Diamonds):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1000"
                  max="1000000"
                  value={diamondRate}
                  onChange={(e) => setDiamondRate(parseInt(e.target.value) || 10000)}
                  className="w-36 bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-emerald-300 font-mono font-bold"
                />
                <span className="text-xs text-slate-400">Diamonds per 1 USD payout</span>
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Support Contacts & Rates</span>
            </button>
          </form>
        </div>
      )}

      {/* 6. SHOWCASE SCREENSHOTS & MEDIA MANAGER */}
      {activeSubTab === 'screenshots' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-pink-400" />
                  Showcase App Screenshots Manager ({screenshots.length} Screens)
                </h3>
                <p className="text-xs text-slate-400">
                  Screenshots automatically slide on the public landing screen and glide through the continuous marquee.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetAppScreenshots}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Default Media</span>
                </button>
                <button
                  type="button"
                  onClick={openAddScreenshotModal}
                  className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Screenshot</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {screenshots.map((shot, idx) => (
                <div 
                  key={shot.id} 
                  className="bg-slate-950/80 border border-slate-800 hover:border-pink-500/50 rounded-2xl p-4 shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full overflow-hidden rounded-xl bg-slate-900 mb-3 border border-slate-800">
                      <img 
                        src={shot.src} 
                        alt={shot.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-amber-400 truncate">
                        {shot.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2">
                      {shot.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Category: {shot.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => openEditScreenshotModal(shot)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-pink-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (screenshots.length <= 1) {
                          alert('At least one screenshot is required for the showcase.');
                          return;
                        }
                        deleteAppScreenshot(shot.id);
                        showNotification('Screenshot removed.');
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. CUSTOM SECTIONS & RULES PAGES */}
      {activeSubTab === 'sections' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-400" />
                  Custom Content Sections & Guidelines ({(appConfig.customSections || []).length})
                </h3>
                <p className="text-xs text-slate-400">
                  Create custom information cards, app rules, agency targets, and policy sections that can be displayed publicly or in the staff portal.
                </p>
              </div>

              <button
                type="button"
                onClick={openAddSectionModal}
                className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Content Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(appConfig.customSections || []).map((sec) => (
                <div key={sec.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        {sec.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {sec.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{sec.category || 'General'}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        sec.showInPublic ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {sec.showInPublic ? 'Public Landing' : 'Staff Only'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{sec.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mt-1">{sec.content}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => openEditSectionModal(sec)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-teal-400" />
                      <span>Edit Section</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteCustomSection(sec.id);
                        showNotification('Section removed.');
                      }}
                      className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. URGENT POPUP ANNOUNCEMENT NOTICE */}
      {activeSubTab === 'popup' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSavePopupNotice} className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2 mb-1">
                <BellRing className="w-5 h-5 text-rose-400" />
                Urgent Popup Announcement Modal
              </h3>
              <p className="text-xs text-slate-400">
                When enabled, a prominent alert modal will pop up for anyone opening the portal. Ideal for urgent server alerts, Eid greetings, or coin sale announcements.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Enable Popup Announcement:</span>
                <span className="text-[11px] text-slate-400">Show this modal on visitor screen with a close button</span>
              </div>
              <input
                type="checkbox"
                checked={popupEnabled}
                onChange={(e) => setPopupEnabled(e.target.checked)}
                className="w-5 h-5 rounded text-rose-600 focus:ring-0 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Popup Title:
              </label>
              <input
                type="text"
                value={popupTitle}
                onChange={(e) => setPopupTitle(e.target.value)}
                placeholder="e.g. 📢 Official Mega Coin Bonus Event"
                className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Badge Label:
              </label>
              <input
                type="text"
                value={popupBadge}
                onChange={(e) => setPopupBadge(e.target.value)}
                placeholder="e.g. URGENT, NOTICE, or EVENT"
                className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Announcement Message / Body:
              </label>
              <textarea
                rows={4}
                value={popupMessage}
                onChange={(e) => setPopupMessage(e.target.value)}
                placeholder="Write the full announcement message here..."
                className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold transition shadow-lg shadow-rose-950 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Popup Notice</span>
            </button>
          </form>
        </div>
      )}

      {/* 9. RAW JSON GOD-MODE LIVE CODE EDITOR */}
      {activeSubTab === 'raw_json' && (
        <div className="bg-slate-900/90 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-amber-300 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                Raw JSON God-Mode Database Editor
              </h3>
              <p className="text-xs text-slate-400">
                Direct access to the whole application state: Edit ANY property, prices, accounts, or configuration directly as JSON and hit "Apply Live".
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    const parsed = JSON.parse(rawJsonText);
                    setRawJsonText(JSON.stringify(parsed, null, 2));
                    setJsonError('');
                    showNotification('JSON formatted cleanly!');
                  } catch (e: any) {
                    setJsonError(`Cannot format: ${e.message}`);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Format JSON
              </button>
              <button
                type="button"
                onClick={handleApplyRawJson}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-lg shadow-amber-950 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Apply & Save Full Database Live</span>
              </button>
            </div>
          </div>

          {jsonError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-600 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{jsonError}</span>
            </div>
          )}

          <div className="space-y-2">
            <textarea
              rows={22}
              value={rawJsonText}
              onChange={(e) => setRawJsonText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-2xl p-4 font-mono text-xs text-amber-300/90 leading-relaxed focus:outline-none shadow-inner"
              spellCheck={false}
            />
            <p className="text-[11px] text-slate-500">
              💡 Tip: You can copy this JSON to a text file, edit it anytime, or paste it back here to instantly replace everything on the website.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT COIN PACKAGE */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsPackageModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                <span>{editingPackageId ? 'Edit Coin Package Rates' : 'Create New Coin Package'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Set coin amounts, free bonus coins, and custom prices across PKR, USD, and INR.
              </p>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Coins Amount <span className="text-rose-400">*</span>:
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pkgCoins}
                    onChange={(e) => setPkgCoins(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Bonus Coins Free:
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={pkgBonus}
                    onChange={(e) => setPkgBonus(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-emerald-300 font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Price in Pakistan PKR (Rs.) <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={pkgPricePKR}
                  onChange={(e) => setPkgPricePKR(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Price in USD ($):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={pkgPriceUSD}
                    onChange={(e) => setPkgPriceUSD(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Price in INR (₹):
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={pkgPriceINR}
                    onChange={(e) => setPkgPriceINR(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Badge Label (e.g. Starter, Popular, VIP Choice, Crown Whale):
                </label>
                <input
                  type="text"
                  value={pkgBadge}
                  onChange={(e) => setPkgBadge(e.target.value)}
                  placeholder="e.g. VIP Choice 👑"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer shadow"
                >
                  {editingPackageId ? 'Save Changes' : 'Add Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SCREENSHOT */}
      {isScreenshotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-pink-500/50 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsScreenshotModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-400" />
                <span>{editingScreenshotId ? 'Edit Screenshot' : 'Add Showcase Screenshot'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Provide an image path or URL to showcase in the public slider and marquee.
              </p>
            </div>

            <form onSubmit={handleSaveScreenshot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Image Path / URL <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={screenSrc}
                  onChange={(e) => setScreenSrc(e.target.value)}
                  placeholder="/assets/aistudio/... or https://..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Screenshot Title <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={screenTitle}
                  onChange={(e) => setScreenTitle(e.target.value)}
                  placeholder="e.g. VIP Audio Room Stage & Live PK Battle"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Category:
                  </label>
                  <input
                    type="text"
                    value={screenCategory}
                    onChange={(e) => setScreenCategory(e.target.value)}
                    placeholder="e.g. Mic Stage PK"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Badge Title:
                  </label>
                  <input
                    type="text"
                    value={screenBadge}
                    onChange={(e) => setScreenBadge(e.target.value)}
                    placeholder="e.g. 👑 Official UI"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsScreenshotModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition cursor-pointer shadow"
                >
                  {editingScreenshotId ? 'Save Changes' : 'Add Screenshot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CUSTOM CONTENT SECTION */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-teal-500/50 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsSectionModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <span>{editingSectionId ? 'Edit Content Section' : 'Create Custom Content Section'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Add rules, instructions, or agency policies to your website.
              </p>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Section Title <span className="text-rose-400">*</span>:
                </label>
                <input
                  type="text"
                  required
                  value={secTitle}
                  onChange={(e) => setSecTitle(e.target.value)}
                  placeholder="e.g. Official Voice Room Etiquette & Rules"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Badge Title:
                  </label>
                  <input
                    type="text"
                    value={secBadge}
                    onChange={(e) => setSecBadge(e.target.value)}
                    placeholder="e.g. 📜 Rules or 👑 VIP"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Category:
                  </label>
                  <input
                    type="text"
                    value={secCategory}
                    onChange={(e) => setSecCategory(e.target.value)}
                    placeholder="e.g. Guidelines or Agency"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Content / Details <span className="text-rose-400">*</span>:
                </label>
                <textarea
                  rows={4}
                  required
                  value={secContent}
                  onChange={(e) => setSecContent(e.target.value)}
                  placeholder="Write instructions, rules, or policies here..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Display on Public Landing:</span>
                  <span className="text-[10px] text-slate-400">If unchecked, visible only when logged into admin</span>
                </div>
                <input
                  type="checkbox"
                  checked={secPublic}
                  onChange={(e) => setSecPublic(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition cursor-pointer shadow"
                >
                  {editingSectionId ? 'Save Changes' : 'Add Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
