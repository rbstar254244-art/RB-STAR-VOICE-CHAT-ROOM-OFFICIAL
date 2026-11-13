import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { 
  AdminUser, 
  UserRole,
  CoinReseller, 
  VoiceRoom, 
  Agency, 
  BDManager, 
  SupportTicket, 
  CoinPackage, 
  CoinTransaction, 
  AppConnectionConfig,
  HostMember,
  BannedUser,
  StaffApplication,
  FreeCoinGrant,
  AppScreenshot,
  WebsiteTheme,
  TabRenameMap,
  CustomPageSection
} from '../types';
import { 
  INITIAL_MASTER_PASSWORD, 
  INITIAL_ADMIN_USERS, 
  INITIAL_RESELLERS, 
  INITIAL_VOICE_ROOMS, 
  INITIAL_AGENCIES, 
  INITIAL_BDS, 
  INITIAL_TICKETS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_COIN_PACKAGES, 
  INITIAL_APP_CONFIG,
  INITIAL_BANNED_USERS,
  INITIAL_STAFF_APPLICATIONS,
  INITIAL_APP_SCREENSHOTS
} from '../data/initialData';
import { 
  getLockoutStatus, 
  recordFailedLoginAttempt, 
  resetFailedLoginAttempts, 
  cleanPlainInput 
} from '../utils/security';
import {
  BackendStatus,
  apiChangePasswordInfinityFree,
  apiLoginInfinityFree,
  checkBackendStatus,
  fetchFullDatabaseFromInfinityFree,
  fetchPublicDataFromInfinityFree,
  saveFullDatabaseToInfinityFree,
  setStoredApiToken,
  submitApplicationToInfinityFree
} from '../services/infinityFreeApi';

export type NavTab = 
  | 'overview' 
  | 'site_editor'
  | 'resellers' 
  | 'free_coins'
  | 'admins' 
  | 'cs' 
  | 'bd' 
  | 'agencies' 
  | 'verification' 
  | 'connect' 
  | 'settings';

interface AppContextType {
  // Security & Password
  masterPassword: string;
  isUnlocked: boolean;
  unlockPortal: (password: string) => Promise<boolean>;
  lockPortal: () => void;
  changeMasterPassword: (newPassword: string) => Promise<boolean>;

  // InfinityFree MySQL Backend Sync
  backendStatus: BackendStatus;
  isSyncingDb: boolean;
  lastDbSyncAt: string | null;
  syncNowToInfinityFree: () => Promise<boolean>;
  pullFromInfinityFree: () => Promise<boolean>;
  
  // Navigation & UI
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isRomanUrdu: boolean;
  setIsRomanUrdu: (val: boolean | ((prev: boolean) => boolean)) => void;
  
  // Verification Quick Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  lookupId: (idToFind: string) => {
    found: boolean;
    type?: UserRole | 'agency' | 'host' | 'unknown';
    data?: any;
    warning?: string;
  };
  
  // Broadcasts
  broadcasts: { id: string; message: string; timestamp: string; sender: string }[];
  sendBroadcast: (message: string) => void;
  
  // Super Admin: Ban & Unban Management
  bannedUsers: BannedUser[];
  banUser: (params: {
    appId: string;
    userName?: string;
    banType: BannedUser['banType'];
    reason: string;
  }) => void;
  unbanUser: (appIdOrId: string) => void;
  
  // Data entities
  adminUsers: AdminUser[];
  addAdminUser: (user: Omit<AdminUser, 'id' | 'joinedDate'>) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  clearAllStaffExceptOwner: () => void;
  
  coinResellers: CoinReseller[];
  addCoinReseller: (reseller: Omit<CoinReseller, 'id' | 'verifiedSince' | 'rating' | 'totalCoinsSold'>) => void;
  updateCoinReseller: (id: string, updates: Partial<CoinReseller>) => void;
  deleteCoinReseller: (id: string) => void;
  
  voiceRooms: VoiceRoom[];
  toggleRoomLock: (roomId: string) => void;
  toggleFeaturedRoom: (roomId: string) => void;
  muteSeat: (roomId: string, seatIndex: number) => void;
  kickSeat: (roomId: string, seatIndex: number) => void;
  addNewRoom: (room: Omit<VoiceRoom, 'id' | 'micSeats' | 'hotScore' | 'listenersCount'>) => void;
  
  agencies: Agency[];
  addAgency: (agency: Omit<Agency, 'id' | 'totalHosts' | 'monthlyDiamonds' | 'hosts'>) => void;
  addHostToAgency: (agencyId: string, host: Omit<HostMember, 'id' | 'joinedDate' | 'liveHoursThisMonth' | 'diamondsEarned' | 'status'>) => void;
  
  bdManagers: BDManager[];
  addBDManager: (bd: Omit<BDManager, 'id' | 'totalAgenciesRecruited' | 'achievedDiamonds' | 'commissionEarnedUSD'>) => void;
  
  tickets: SupportTicket[];
  addTicket: (t: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'lastReply'>) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status'], assignedCsName?: string) => void;
  
  coinPackages: CoinPackage[];
  addCoinPackage: (pkg: Omit<CoinPackage, 'id'>) => CoinPackage;
  updateCoinPackage: (id: string, updates: Partial<CoinPackage>) => void;
  deleteCoinPackage: (id: string) => void;
  bulkAdjustCoinPrices: (percentageChange: number, currency: 'PKR' | 'USD' | 'INR' | 'all') => void;
  resetCoinPackages: () => void;

  // Website Showcase Screenshots & Media Customizer
  screenshots: AppScreenshot[];
  addAppScreenshot: (screenshot: Omit<AppScreenshot, 'id'>) => AppScreenshot;
  updateAppScreenshot: (id: string, updates: Partial<AppScreenshot>) => void;
  deleteAppScreenshot: (id: string) => void;
  resetAppScreenshots: () => void;

  transactions: CoinTransaction[];
  createCoinTransfer: (params: {
    resellerId: string;
    buyerAppId: string;
    buyerName: string;
    coinsAmount: number;
    bonusAmount: number;
    totalPaid: number;
    currency: string;
    paymentMethod: string;
  }) => CoinTransaction;

  // Free Coins Generator (100% Separate from purchasing)
  freeCoinGrants: FreeCoinGrant[];
  totalFreeCoinsMinted: number;
  mintFreeCoins: (params: {
    receiverAppId: string;
    receiverName?: string;
    coinsAmount: number;
    category?: 'owner_unlimited_mint' | 'host_bonus' | 'vip_reward' | 'event_giveaway' | 'custom_grant';
    notes?: string;
  }) => FreeCoinGrant;
  deleteFreeCoinGrant: (id: string) => void;
  
  appConfig: AppConnectionConfig;
  updateAppConfig: (updates: Partial<AppConnectionConfig>) => void;
  testAppPing: () => Promise<number>;
  
  // Staff Applications & CNIC Dossier
  staffApplications: StaffApplication[];
  submitStaffApplication: (app: Omit<StaffApplication, 'id' | 'submittedAt' | 'status'>) => StaffApplication;
  approveStaffApplication: (applicationId: string) => void;
  rejectStaffApplication: (applicationId: string) => void;
  deleteStaffApplication: (applicationId: string) => void;
  
  // Active Dossier Modal & Onboarding Modal
  dossierTargetAppId: string | null;
  setDossierTargetAppId: (appId: string | null) => void;
  onboardingModalOpen: boolean;
  setOnboardingModalOpen: (open: boolean) => void;
  onboardingTargetRole: 'admin' | 'bd' | 'super_admin';
  setOnboardingTargetRole: (role: 'admin' | 'bd' | 'super_admin') => void;

  // Full Website Customization
  setWebsiteTheme: (theme: WebsiteTheme) => void;
  renameTab: (tabId: keyof TabRenameMap, newLabel: string) => void;
  resetTabNames: () => void;
  addCustomSection: (sec: Omit<CustomPageSection, 'id'>) => CustomPageSection;
  updateCustomSection: (id: string, updates: Partial<CustomPageSection>) => void;
  deleteCustomSection: (id: string) => void;
  setPopupNotice: (notice: AppConnectionConfig['popupNotice']) => void;
  applyFullDatabaseJSON: (fullData: any) => boolean;

  // Backup / restore
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'RBSTAR_VOICEROOM_STATE_V5';
const PASSWORD_STORAGE_KEY = 'RBSTAR_MASTER_PASSWORD_V3';

function safeLoadJSON<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Master Password State (Owner can set any password)
  const [masterPassword, setMasterPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(PASSWORD_STORAGE_KEY);
      return saved || INITIAL_MASTER_PASSWORD;
    } catch {
      return INITIAL_MASTER_PASSWORD;
    }
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('VOICEROOM_IS_UNLOCKED') === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isRomanUrdu, setIsRomanUrdu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary State
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_banned_users', INITIAL_BANNED_USERS)
  );

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_admins', INITIAL_ADMIN_USERS)
  );

  const [coinResellers, setCoinResellers] = useState<CoinReseller[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_resellers', INITIAL_RESELLERS)
  );

  const [voiceRooms, setVoiceRooms] = useState<VoiceRoom[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_rooms', INITIAL_VOICE_ROOMS)
  );

  const [agencies, setAgencies] = useState<Agency[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_agencies', INITIAL_AGENCIES)
  );

  const [bdManagers, setBdManagers] = useState<BDManager[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_bds', INITIAL_BDS)
  );

  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_tickets', INITIAL_TICKETS)
  );

  const [transactions, setTransactions] = useState<CoinTransaction[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_transactions', INITIAL_TRANSACTIONS)
  );

  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_coin_packages', INITIAL_COIN_PACKAGES)
  );

  const [screenshots, setScreenshots] = useState<AppScreenshot[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_screenshots', INITIAL_APP_SCREENSHOTS)
  );

  const [appConfig, setAppConfig] = useState<AppConnectionConfig>(() => {
    const parsed = safeLoadJSON<Partial<AppConnectionConfig> | null>(STORAGE_KEY + '_app_config', null);
    return parsed ? { ...INITIAL_APP_CONFIG, ...parsed } : INITIAL_APP_CONFIG;
  });

  const [broadcasts, setBroadcasts] = useState<{ id: string; message: string; timestamp: string; sender: string }[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_coin_packages', JSON.stringify(coinPackages));
  }, [coinPackages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_screenshots', JSON.stringify(screenshots));
  }, [screenshots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_app_config', JSON.stringify(appConfig));
  }, [appConfig]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_admins', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_resellers', JSON.stringify(coinResellers));
  }, [coinResellers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_rooms', JSON.stringify(voiceRooms));
  }, [voiceRooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_agencies', JSON.stringify(agencies));
  }, [agencies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_bds', JSON.stringify(bdManagers));
  }, [bdManagers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_banned_users', JSON.stringify(bannedUsers));
  }, [bannedUsers]);

  const [staffApplications, setStaffApplications] = useState<StaffApplication[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_staff_applications', INITIAL_STAFF_APPLICATIONS)
  );

  const [dossierTargetAppId, setDossierTargetAppId] = useState<string | null>(null);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);
  const [onboardingTargetRole, setOnboardingTargetRole] = useState<'admin' | 'bd' | 'super_admin'>('admin');

  // URL Query listener for shareable links (?dossier=100001 or ?apply=admin)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dossierParam = params.get('dossier') || params.get('staff') || params.get('staff_dossier') || params.get('id') || params.get('verify_staff');
      if (dossierParam) {
        setDossierTargetAppId(dossierParam.trim());
      }
      const applyParam = params.get('apply');
      if (applyParam) {
        setOnboardingTargetRole(applyParam === 'bd' ? 'bd' : (applyParam === 'super_admin' ? 'super_admin' : 'admin'));
        setOnboardingModalOpen(true);
      }
    } catch {
      // Ignore URL parsing errors in sandboxed environments
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_staff_applications', JSON.stringify(staffApplications));
  }, [staffApplications]);

  const submitStaffApplication = (app: Omit<StaffApplication, 'id' | 'submittedAt' | 'status'>): StaffApplication => {
    const newApp: StaffApplication = {
      ...app,
      id: `app-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending'
    };
    setStaffApplications(prev => [newApp, ...prev]);
    // Also persist directly to InfinityFree MySQL when hosted
    void submitApplicationToInfinityFree(app);
    return newApp;
  };

  const approveStaffApplication = (applicationId: string) => {
    const app = staffApplications.find(a => a.id === applicationId);
    if (!app) return;

    if (app.role === 'admin') {
      const newAdmin: AdminUser = {
        id: `adm-${Date.now()}`,
        name: app.name,
        appId: app.appId,
        role: 'admin',
        country: 'Pakistan',
        city: app.city || 'Pakistan',
        phone: app.phone,
        whatsapp: app.whatsapp || app.phone,
        cnicNumber: app.cnicNumber,
        cnicFrontImage: app.cnicFrontImage,
        cnicBackImage: app.cnicBackImage,
        appointmentCode: `RB-ADM-${app.appId}`,
        documentsVerified: true,
        avatar: app.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
        status: 'active',
        level: 'Official Simple Admin',
        joinedDate: new Date().toISOString().slice(0, 10),
        badgeTitle: 'Verified Operations Admin',
        notes: app.notes || 'Verified CNIC & Phone via Online Appointment Link'
      };
      setAdminUsers(prev => [newAdmin, ...prev]);
    } else {
      const parentAdmin = adminUsers.find(a => a.id === app.assignedAdminId || a.appId === app.assignedAdminId);
      const newBd: BDManager = {
        id: `bd-${Date.now()}`,
        name: app.name,
        bdCode: `BD-${app.appId.slice(-4)}`,
        appId: app.appId,
        region: app.city || 'Pakistan',
        phone: app.phone,
        whatsapp: app.whatsapp || app.phone,
        avatar: app.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200',
        cnicNumber: app.cnicNumber,
        cnicFrontImage: app.cnicFrontImage,
        cnicBackImage: app.cnicBackImage,
        city: app.city,
        appointmentCode: `RB-BD-${app.appId}`,
        documentsVerified: true,
        joinedDate: new Date().toISOString().slice(0, 10),
        assignedAdminId: parentAdmin ? parentAdmin.id : app.assignedAdminId,
        assignedAdminName: parentAdmin ? `${parentAdmin.name} (ID: ${parentAdmin.appId})` : (app.assignedAdminName || 'Direct Super Admin'),
        totalAgenciesRecruited: 0,
        targetMonthlyDiamonds: 20000000,
        achievedDiamonds: 0,
        commissionEarnedUSD: 0,
        status: 'active'
      };
      setBdManagers(prev => [newBd, ...prev]);
    }

    setStaffApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'approved' } : a));
  };

  const rejectStaffApplication = (applicationId: string) => {
    setStaffApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: 'rejected' } : a));
  };

  const deleteStaffApplication = (applicationId: string) => {
    setStaffApplications(prev => prev.filter(a => a.id !== applicationId));
  };

  // Super Admin: Ban & Unban Handlers
  const banUser = (params: {
    appId: string;
    userName?: string;
    banType: BannedUser['banType'];
    reason: string;
  }) => {
    const cleanAppId = params.appId.trim();
    const newBan: BannedUser = {
      id: `ban-${Date.now()}`,
      appId: cleanAppId,
      userName: params.userName?.trim() || `User_${cleanAppId}`,
      banType: params.banType,
      reason: params.reason,
      bannedBy: 'RB STAR Super Admin',
      bannedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'banned'
    };
    setBannedUsers(prev => [newBan, ...prev.filter(b => b.appId !== cleanAppId)]);
  };

  const unbanUser = (appIdOrId: string) => {
    setBannedUsers(prev => prev.map(b => {
      if (b.id === appIdOrId || b.appId === appIdOrId) {
        return { ...b, status: 'unbanned' };
      }
      return b;
    }));
  };

  const clearAllStaffExceptOwner = () => {
    setAdminUsers([]);
    setBdManagers([]);
    setCoinResellers([]);
    setAgencies([]);
    setBannedUsers([]);
    setTickets([]);
  };

  // InfinityFree MySQL Sync State
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    isPhpHost: false,
    configured: false,
    dbReady: false,
    authenticated: false,
  });
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);
  const [lastDbSyncAt, setLastDbSyncAt] = useState<string | null>(null);
  const skipNextAutoSyncRef = useRef<boolean>(false);

  const hydrateFromRemoteSnapshot = useCallback((remote: any) => {
    skipNextAutoSyncRef.current = true;
    if (remote.appConfig && typeof remote.appConfig === 'object') {
      setAppConfig(prev => ({ ...prev, ...remote.appConfig }));
    }
    if (Array.isArray(remote.coinPackages)) setCoinPackages(remote.coinPackages);
    if (Array.isArray(remote.screenshots)) setScreenshots(remote.screenshots);
    if (Array.isArray(remote.adminUsers)) setAdminUsers(remote.adminUsers);
    if (Array.isArray(remote.coinResellers)) setCoinResellers(remote.coinResellers);
    if (Array.isArray(remote.voiceRooms)) setVoiceRooms(remote.voiceRooms);
    if (Array.isArray(remote.agencies)) setAgencies(remote.agencies);
    if (Array.isArray(remote.bdManagers)) setBdManagers(remote.bdManagers);
    if (Array.isArray(remote.tickets)) setTickets(remote.tickets);
    if (Array.isArray(remote.transactions)) setTransactions(remote.transactions);
    if (Array.isArray(remote.freeCoinGrants)) setFreeCoinGrants(remote.freeCoinGrants);
    if (Array.isArray(remote.bannedUsers)) setBannedUsers(remote.bannedUsers);
    if (Array.isArray(remote.staffApplications)) setStaffApplications(remote.staffApplications);
    if (Array.isArray(remote.broadcasts)) setBroadcasts(remote.broadcasts);
  }, []);

  const pullFromInfinityFree = useCallback(async (): Promise<boolean> => {
    setIsSyncingDb(true);
    try {
      const status = await checkBackendStatus();
      setBackendStatus(status);
      if (status.isPhpHost && status.dbReady && status.authenticated) {
        const remote = await fetchFullDatabaseFromInfinityFree();
        if (remote) {
          hydrateFromRemoteSnapshot(remote);
          setLastDbSyncAt(new Date().toLocaleTimeString());
          return true;
        }
      }
      return false;
    } finally {
      setIsSyncingDb(false);
    }
  }, [hydrateFromRemoteSnapshot]);

  // Initial InfinityFree Backend Detection & Public Data Load
  useEffect(() => {
    let active = true;
    (async () => {
      const status = await checkBackendStatus();
      if (!active) return;
      setBackendStatus(status);

      if (status.isPhpHost && status.dbReady) {
        if (status.authenticated) {
          const full = await fetchFullDatabaseFromInfinityFree();
          if (active && full) {
            hydrateFromRemoteSnapshot(full);
            setIsUnlocked(true);
            sessionStorage.setItem('VOICEROOM_IS_UNLOCKED', 'true');
            setLastDbSyncAt(new Date().toLocaleTimeString());
            return;
          }
        }
        const pub = await fetchPublicDataFromInfinityFree();
        if (active && pub) {
          skipNextAutoSyncRef.current = true;
          if (pub.appConfig) setAppConfig(prev => ({ ...prev, ...pub.appConfig }));
          if (pub.coinPackages) setCoinPackages(pub.coinPackages);
          if (pub.screenshots) setScreenshots(pub.screenshots);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [hydrateFromRemoteSnapshot]);

  // Master Password Controls with Brute Force Protection & InfinityFree Server Auth
  const unlockPortal = async (password: string): Promise<boolean> => {
    const lockout = getLockoutStatus();
    if (lockout.isLocked) {
      return false;
    }

    const cleanInput = password ? password.trim() : '';
    if (!cleanInput) return false;

    // 1. Try InfinityFree PHP + MySQL auth when deployed on PHP host
    const serverRes = await apiLoginInfinityFree(cleanInput);
    if (serverRes.handledByBackend) {
      if (serverRes.ok) {
        resetFailedLoginAttempts();
        setIsUnlocked(true);
        sessionStorage.setItem('VOICEROOM_IS_UNLOCKED', 'true');
        const status = await checkBackendStatus();
        setBackendStatus(status);
        const full = await fetchFullDatabaseFromInfinityFree();
        if (full) {
          hydrateFromRemoteSnapshot(full);
          setLastDbSyncAt(new Date().toLocaleTimeString());
        }
        return true;
      }
      recordFailedLoginAttempt();
      return false;
    }

    // 2. Preview / Offline fallback check
    if (cleanInput === masterPassword) {
      resetFailedLoginAttempts();
      setIsUnlocked(true);
      sessionStorage.setItem('VOICEROOM_IS_UNLOCKED', 'true');
      return true;
    }

    recordFailedLoginAttempt();
    return false;
  };

  const lockPortal = () => {
    setIsUnlocked(false);
    setStoredApiToken(null);
    sessionStorage.removeItem('VOICEROOM_IS_UNLOCKED');
    setBackendStatus(prev => ({ ...prev, authenticated: false }));
  };

  const changeMasterPassword = async (newPassword: string): Promise<boolean> => {
    if (!isUnlocked) return false;
    if (!newPassword || newPassword.trim().length < 3) return false;
    const sanitized = cleanPlainInput(newPassword.trim());

    if (backendStatus.isPhpHost && backendStatus.dbReady) {
      const serverRes = await apiChangePasswordInfinityFree(sanitized);
      if (serverRes.handledByBackend && !serverRes.ok) {
        return false;
      }
    }

    setMasterPassword(sanitized);
    localStorage.setItem(PASSWORD_STORAGE_KEY, sanitized);
    return true;
  };

  // Automated Session Security: Auto-lock after 30 minutes of inactivity
  useEffect(() => {
    if (!isUnlocked) return;

    let timeoutId: any;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsUnlocked(false);
        sessionStorage.removeItem('VOICEROOM_IS_UNLOCKED');
      }, 30 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [isUnlocked]);

  // Broadcast
  const sendBroadcast = (message: string) => {
    const newBroadcast = {
      id: `bc-${Date.now()}`,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'Super Admin'
    };
    setBroadcasts(prev => [newBroadcast, ...prev]);
  };

  // Staff Admin Actions
  const addAdminUser = (user: Omit<AdminUser, 'id' | 'joinedDate'>) => {
    const newAdmin: AdminUser = {
      ...user,
      id: `adm-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setAdminUsers(prev => [newAdmin, ...prev]);
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== id));
  };

  // Resellers Actions
  const addCoinReseller = (reseller: Omit<CoinReseller, 'id' | 'verifiedSince' | 'rating' | 'totalCoinsSold'>) => {
    const newReseller: CoinReseller = {
      ...reseller,
      id: `cr-${Date.now()}`,
      rating: 5.0,
      totalCoinsSold: 0,
      verifiedSince: new Date().toISOString().split('T')[0]
    };
    setCoinResellers(prev => [newReseller, ...prev]);
  };

  const updateCoinReseller = (id: string, updates: Partial<CoinReseller>) => {
    setCoinResellers(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteCoinReseller = (id: string) => {
    setCoinResellers(prev => prev.filter(r => r.id !== id));
  };

  // Voice Rooms Controls
  const toggleRoomLock = (roomId: string) => {
    setVoiceRooms(prev => prev.map(r => r.id === roomId ? { ...r, isLocked: !r.isLocked } : r));
  };

  const toggleFeaturedRoom = (roomId: string) => {
    setVoiceRooms(prev => prev.map(r => r.id === roomId ? { ...r, isFeatured: !r.isFeatured } : r));
  };

  const muteSeat = (roomId: string, seatIndex: number) => {
    setVoiceRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      return {
        ...r,
        micSeats: r.micSeats.map(s => s.seatIndex === seatIndex ? { ...s, isMuted: !s.isMuted } : s)
      };
    }));
  };

  const kickSeat = (roomId: string, seatIndex: number) => {
    setVoiceRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      return {
        ...r,
        micSeats: r.micSeats.map(s => s.seatIndex === seatIndex ? {
          ...s,
          occupantAppId: undefined,
          occupantName: undefined,
          avatar: undefined,
          isTalking: false,
          isMuted: false
        } : s)
      };
    }));
  };

  const addNewRoom = (room: Omit<VoiceRoom, 'id' | 'micSeats' | 'hotScore' | 'listenersCount'>) => {
    const seats: VoiceRoom['micSeats'] = [
      {
        seatIndex: 0,
        occupantAppId: room.hostAppId,
        occupantName: `${room.hostName} (Host)`,
        avatar: room.hostAvatar,
        isMuted: false,
        isLocked: false,
        isTalking: true
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        seatIndex: i + 1,
        occupantAppId: undefined,
        isMuted: false,
        isLocked: false,
        isTalking: false
      }))
    ];

    const newRoom: VoiceRoom = {
      ...room,
      id: `vr-${Date.now()}`,
      hotScore: 10000,
      listenersCount: 1,
      micSeats: seats
    };
    setVoiceRooms(prev => [newRoom, ...prev]);
  };

  // Agency Controls
  const addAgency = (agency: Omit<Agency, 'id' | 'totalHosts' | 'monthlyDiamonds' | 'hosts'>) => {
    const newAgency: Agency = {
      ...agency,
      id: `ag-${Date.now()}`,
      totalHosts: 0,
      monthlyDiamonds: 0,
      hosts: []
    };
    setAgencies(prev => [newAgency, ...prev]);
  };

  const addHostToAgency = (agencyId: string, host: Omit<HostMember, 'id' | 'joinedDate' | 'liveHoursThisMonth' | 'diamondsEarned' | 'status'>) => {
    const newHost: HostMember = {
      ...host,
      id: `h-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      liveHoursThisMonth: 0,
      diamondsEarned: 0,
      status: 'offline'
    };

    setAgencies(prev => prev.map(a => {
      if (a.id !== agencyId) return a;
      return {
        ...a,
        totalHosts: a.totalHosts + 1,
        hosts: [newHost, ...a.hosts]
      };
    }));
  };

  // BD Controls
  const addBDManager = (bd: Omit<BDManager, 'id' | 'totalAgenciesRecruited' | 'achievedDiamonds' | 'commissionEarnedUSD'>) => {
    const newBD: BDManager = {
      ...bd,
      id: `bd-${Date.now()}`,
      totalAgenciesRecruited: 0,
      achievedDiamonds: 0,
      commissionEarnedUSD: 0
    };
    setBdManagers(prev => [newBD, ...prev]);
  };

  // Tickets Controls
  const addTicket = (t: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'lastReply'>) => {
    const newTicket: SupportTicket = {
      ...t,
      id: `t-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      lastReply: 'Just created'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (id: string, status: SupportTicket['status'], assignedCsName?: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        status,
        assignedCsName: assignedCsName || t.assignedCsName,
        lastReply: 'Updated by CS just now'
      };
    }));
  };

  // Coin Transfer
  const createCoinTransfer = (params: {
    resellerId: string;
    buyerAppId: string;
    buyerName: string;
    coinsAmount: number;
    bonusAmount: number;
    totalPaid: number;
    currency: string;
    paymentMethod: string;
  }): CoinTransaction => {
    const reseller = coinResellers.find(r => r.id === params.resellerId);
    const newTx: CoinTransaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: `RCP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      resellerId: params.resellerId,
      resellerName: reseller?.name || 'Official Coin Reseller',
      buyerAppId: params.buyerAppId,
      buyerName: params.buyerName,
      coinsAmount: params.coinsAmount,
      bonusAmount: params.bonusAmount,
      totalPaid: params.totalPaid,
      currency: params.currency,
      paymentMethod: params.paymentMethod,
      timestamp: new Date().toLocaleString(),
      status: 'completed'
    };

    setTransactions(prev => [newTx, ...prev]);

    // deduct from reseller coins available
    if (reseller) {
      updateCoinReseller(params.resellerId, {
        coinsAvailable: Math.max(0, reseller.coinsAvailable - params.coinsAmount),
        totalCoinsSold: reseller.totalCoinsSold + params.coinsAmount
      });
    }

    return newTx;
  };

  // Free Coins Generator (Unlimited Mint - 100% Separate from purchasing)
  const [freeCoinGrants, setFreeCoinGrants] = useState<FreeCoinGrant[]>(() =>
    safeLoadJSON(STORAGE_KEY + '_free_coin_grants', [])
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_free_coin_grants', JSON.stringify(freeCoinGrants));
  }, [freeCoinGrants]);

  const totalFreeCoinsMinted = freeCoinGrants.reduce((acc, g) => acc + (Number(g.coinsAmount) || 0), 0);

  const mintFreeCoins = (params: {
    receiverAppId: string;
    receiverName?: string;
    coinsAmount: number;
    category?: 'owner_unlimited_mint' | 'host_bonus' | 'vip_reward' | 'event_giveaway' | 'custom_grant';
    notes?: string;
  }): FreeCoinGrant => {
    const sanitizedAppId = cleanPlainInput(params.receiverAppId.trim());
    const grant: FreeCoinGrant = {
      id: `grant-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      grantCode: `FREE-COIN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      receiverAppId: sanitizedAppId,
      receiverName: params.receiverName ? cleanPlainInput(params.receiverName.trim()) : `User #${sanitizedAppId}`,
      coinsAmount: Math.max(1, Math.floor(Number(params.coinsAmount) || 0)),
      category: params.category || 'owner_unlimited_mint',
      notes: params.notes ? cleanPlainInput(params.notes.trim()) : 'Direct Owner Free Coin Mint (Zero Cost - Unlimited)',
      grantedBy: 'RB STAR Portal Owner (Master Key)',
      timestamp: new Date().toLocaleString(),
      status: 'minted'
    };

    setFreeCoinGrants(prev => [grant, ...prev]);
    return grant;
  };

  const deleteFreeCoinGrant = (id: string) => {
    setFreeCoinGrants(prev => prev.filter(g => g.id !== id));
  };

  // App Connection Config
  const updateAppConfig = (updates: Partial<AppConnectionConfig>) => {
    setAppConfig(prev => ({ ...prev, ...updates }));
  };

  const testAppPing = async (): Promise<number> => {
    updateAppConfig({ serverStatus: 'connecting' });
    await new Promise(resolve => setTimeout(resolve, 800));
    const simulatedPing = Math.floor(18 + Math.random() * 25);
    updateAppConfig({
      serverStatus: 'connected',
      lastPingMs: simulatedPing,
      lastSyncedAt: 'Just now',
      totalApiRequests: appConfig.totalApiRequests + 1
    });
    return simulatedPing;
  };

  // Coin Packages Customization & Pricing Handlers
  const addCoinPackage = (pkg: Omit<CoinPackage, 'id'>): CoinPackage => {
    const newPkg: CoinPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`
    };
    setCoinPackages(prev => [...prev, newPkg]);
    return newPkg;
  };

  const updateCoinPackage = (id: string, updates: Partial<CoinPackage>) => {
    setCoinPackages(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteCoinPackage = (id: string) => {
    setCoinPackages(prev => prev.filter(p => p.id !== id));
  };

  const bulkAdjustCoinPrices = (percentageChange: number, currency: 'PKR' | 'USD' | 'INR' | 'all') => {
    const factor = 1 + percentageChange / 100;
    setCoinPackages(prev => prev.map(p => {
      const updated = { ...p };
      if (currency === 'PKR' || currency === 'all') {
        updated.pricePKR = Math.max(1, Math.round(p.pricePKR * factor));
      }
      if (currency === 'USD' || currency === 'all') {
        updated.priceUSD = Math.max(0.1, Number((p.priceUSD * factor).toFixed(2)));
      }
      if (currency === 'INR' || currency === 'all') {
        updated.priceINR = Math.max(1, Math.round(p.priceINR * factor));
      }
      return updated;
    }));
  };

  const resetCoinPackages = () => {
    setCoinPackages(INITIAL_COIN_PACKAGES);
  };

  // Screenshots Customization Handlers
  const addAppScreenshot = (screenshot: Omit<AppScreenshot, 'id'>): AppScreenshot => {
    const newShot: AppScreenshot = {
      ...screenshot,
      id: `shot-${Date.now()}`
    };
    setScreenshots(prev => [...prev, newShot]);
    return newShot;
  };

  const updateAppScreenshot = (id: string, updates: Partial<AppScreenshot>) => {
    setScreenshots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteAppScreenshot = (id: string) => {
    setScreenshots(prev => prev.filter(s => s.id !== id));
  };

  const resetAppScreenshots = () => {
    setScreenshots(INITIAL_APP_SCREENSHOTS);
  };

  // Full Website Customization Handlers
  const setWebsiteTheme = (theme: WebsiteTheme) => {
    updateAppConfig({ theme });
  };

  const renameTab = (tabId: keyof TabRenameMap, newLabel: string) => {
    setAppConfig(prev => ({
      ...prev,
      tabRenames: {
        ...(prev.tabRenames || {}),
        [tabId]: newLabel.trim()
      }
    }));
  };

  const resetTabNames = () => {
    setAppConfig(prev => ({ ...prev, tabRenames: {} }));
  };

  const addCustomSection = (sec: Omit<CustomPageSection, 'id'>): CustomPageSection => {
    const newSection: CustomPageSection = {
      ...sec,
      id: `sec-${Date.now()}`
    };
    setAppConfig(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSection]
    }));
    return newSection;
  };

  const updateCustomSection = (id: string, updates: Partial<CustomPageSection>) => {
    setAppConfig(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const deleteCustomSection = (id: string) => {
    setAppConfig(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter(s => s.id !== id)
    }));
  };

  const setPopupNotice = (notice: AppConnectionConfig['popupNotice']) => {
    setAppConfig(prev => ({ ...prev, popupNotice: notice }));
  };

  const applyFullDatabaseJSON = (fullData: any): boolean => {
    if (!isUnlocked) return false;
    try {
      if (!fullData || typeof fullData !== 'object') return false;
      if (Array.isArray(fullData.adminUsers)) setAdminUsers(fullData.adminUsers);
      if (Array.isArray(fullData.coinResellers)) setCoinResellers(fullData.coinResellers);
      if (Array.isArray(fullData.voiceRooms)) setVoiceRooms(fullData.voiceRooms);
      if (Array.isArray(fullData.agencies)) setAgencies(fullData.agencies);
      if (Array.isArray(fullData.bdManagers)) setBdManagers(fullData.bdManagers);
      if (Array.isArray(fullData.tickets)) setTickets(fullData.tickets);
      if (Array.isArray(fullData.transactions)) setTransactions(fullData.transactions);
      if (Array.isArray(fullData.freeCoinGrants)) setFreeCoinGrants(fullData.freeCoinGrants);
      if (Array.isArray(fullData.coinPackages)) setCoinPackages(fullData.coinPackages);
      if (Array.isArray(fullData.screenshots)) setScreenshots(fullData.screenshots);
      if (fullData.appConfig && typeof fullData.appConfig === 'object') setAppConfig(fullData.appConfig);
      if (typeof fullData.masterPassword === 'string' && fullData.masterPassword.trim().length >= 3) {
        const sanitized = cleanPlainInput(fullData.masterPassword.trim());
        setMasterPassword(sanitized);
        localStorage.setItem(PASSWORD_STORAGE_KEY, sanitized);
      }
      return true;
    } catch (e) {
      console.error('Failed to apply raw database JSON', e);
      return false;
    }
  };

  // Universal ID Lookup / Public Verification
  const lookupId = (idToFind: string) => {
    const cleanId = idToFind.trim().toLowerCase();
    if (!cleanId) return { found: false };

    // Check Admins
    const admin = adminUsers.find(a => 
      a.appId.toLowerCase() === cleanId || 
      a.id.toLowerCase() === cleanId || 
      a.phone.replace(/[^0-9]/g, '').includes(cleanId)
    );
    if (admin) {
      return {
        found: true,
        type: admin.role,
        data: admin
      };
    }

    // Check Resellers
    const reseller = coinResellers.find(r => 
      r.appId.toLowerCase() === cleanId || 
      r.resellerCode.toLowerCase() === cleanId || 
      r.whatsappNumber.replace(/[^0-9]/g, '').includes(cleanId)
    );
    if (reseller) {
      return {
        found: true,
        type: 'coin_reseller' as const,
        data: reseller
      };
    }

    // Check Agencies
    const agency = agencies.find(ag => 
      ag.agencyCode.toLowerCase() === cleanId || 
      ag.ownerAppId.toLowerCase() === cleanId ||
      ag.agencyName.toLowerCase().includes(cleanId)
    );
    if (agency) {
      return {
        found: true,
        type: 'agency' as const,
        data: agency
      };
    }

    // Check BDs
    const bd = bdManagers.find(b => 
      b.bdCode.toLowerCase() === cleanId || 
      b.appId.toLowerCase() === cleanId
    );
    if (bd) {
      return {
        found: true,
        type: 'bd' as const,
        data: bd
      };
    }

    // Check Hosts
    for (const ag of agencies) {
      const host = ag.hosts.find(h => h.appId.toLowerCase() === cleanId);
      if (host) {
        return {
          found: true,
          type: 'host' as const,
          data: { ...host, agencyName: ag.agencyName, agencyCode: ag.agencyCode }
        };
      }
    }

    return {
      found: false,
      warning: '⚠️ ATTENTION: This ID is NOT found in the Official Voice App Registry! Do NOT transfer money or share passwords with unverified profiles!'
    };
  };

  // Export & Import
  const exportDatabaseJSON = () => {
    const bundle = {
      exportDate: new Date().toISOString(),
      appName: appConfig.appName,
      masterPassword,
      adminUsers,
      coinResellers,
      voiceRooms,
      agencies,
      bdManagers,
      tickets,
      transactions,
      freeCoinGrants,
      coinPackages,
      screenshots,
      appConfig
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VoiceRoom_Ecosystem_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    // SECURITY: Only authenticated administrator session can import database
    if (!isUnlocked) return false;
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object' || Array.isArray(data)) return false;

      if (Array.isArray(data.adminUsers)) setAdminUsers(data.adminUsers);
      if (Array.isArray(data.coinResellers)) setCoinResellers(data.coinResellers);
      if (Array.isArray(data.voiceRooms)) setVoiceRooms(data.voiceRooms);
      if (Array.isArray(data.agencies)) setAgencies(data.agencies);
      if (Array.isArray(data.bdManagers)) setBdManagers(data.bdManagers);
      if (Array.isArray(data.tickets)) setTickets(data.tickets);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (Array.isArray(data.freeCoinGrants)) setFreeCoinGrants(data.freeCoinGrants);
      if (Array.isArray(data.coinPackages)) setCoinPackages(data.coinPackages);
      if (Array.isArray(data.screenshots)) setScreenshots(data.screenshots);
      if (data.appConfig && typeof data.appConfig === 'object') setAppConfig(data.appConfig);
      if (typeof data.masterPassword === 'string' && data.masterPassword.trim().length >= 3) {
        const sanitized = cleanPlainInput(data.masterPassword.trim());
        setMasterPassword(sanitized);
        localStorage.setItem(PASSWORD_STORAGE_KEY, sanitized);
      }
      return true;
    } catch (e) {
      console.error('Failed to import database JSON', e);
      return false;
    }
  };

  const resetAllData = () => {
    setAdminUsers(INITIAL_ADMIN_USERS);
    setCoinResellers(INITIAL_RESELLERS);
    setVoiceRooms(INITIAL_VOICE_ROOMS);
    setAgencies(INITIAL_AGENCIES);
    setBdManagers(INITIAL_BDS);
    setTickets(INITIAL_TICKETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setFreeCoinGrants([]);
    setCoinPackages(INITIAL_COIN_PACKAGES);
    setScreenshots(INITIAL_APP_SCREENSHOTS);
    setAppConfig(INITIAL_APP_CONFIG);
    setMasterPassword(INITIAL_MASTER_PASSWORD);
    localStorage.removeItem(PASSWORD_STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '_free_coin_grants');
    localStorage.removeItem(STORAGE_KEY + '_coin_packages');
    localStorage.removeItem(STORAGE_KEY + '_screenshots');
    localStorage.removeItem(STORAGE_KEY + '_app_config');
  };

  const syncNowToInfinityFree = useCallback(async (): Promise<boolean> => {
    if (!isUnlocked) return false;
    setIsSyncingDb(true);
    try {
      const res = await saveFullDatabaseToInfinityFree({
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
        freeCoinGrants,
        bannedUsers,
        staffApplications,
        broadcasts,
      });
      if (res.ok) {
        setLastDbSyncAt(res.syncedAt || new Date().toLocaleTimeString());
        return true;
      }
      return false;
    } finally {
      setIsSyncingDb(false);
    }
  }, [
    isUnlocked,
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
    freeCoinGrants,
    bannedUsers,
    staffApplications,
    broadcasts,
  ]);

  // Debounced auto-sync to InfinityFree MySQL whenever admin changes state
  useEffect(() => {
    if (!isUnlocked || !backendStatus.isPhpHost || !backendStatus.dbReady || !backendStatus.authenticated) {
      return;
    }
    if (skipNextAutoSyncRef.current) {
      skipNextAutoSyncRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      void syncNowToInfinityFree();
    }, 800);
    return () => clearTimeout(timer);
  }, [
    isUnlocked,
    backendStatus.isPhpHost,
    backendStatus.dbReady,
    backendStatus.authenticated,
    syncNowToInfinityFree,
  ]);

  return (
    <AppContext.Provider
      value={{
        masterPassword,
        isUnlocked,
        unlockPortal,
        lockPortal,
        changeMasterPassword,
        backendStatus,
        isSyncingDb,
        lastDbSyncAt,
        syncNowToInfinityFree,
        pullFromInfinityFree,
        activeTab,
        setActiveTab,
        isRomanUrdu,
        setIsRomanUrdu,
        searchQuery,
        setSearchQuery,
        lookupId,
        broadcasts,
        sendBroadcast,
        bannedUsers,
        banUser,
        unbanUser,
        adminUsers,
        addAdminUser,
        updateAdminUser,
        deleteAdminUser,
        clearAllStaffExceptOwner,
        coinResellers,
        addCoinReseller,
        updateCoinReseller,
        deleteCoinReseller,
        voiceRooms,
        toggleRoomLock,
        toggleFeaturedRoom,
        muteSeat,
        kickSeat,
        addNewRoom,
        agencies,
        addAgency,
        addHostToAgency,
        bdManagers,
        addBDManager,
        tickets,
        addTicket,
        updateTicketStatus,
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
        transactions,
        createCoinTransfer,
        freeCoinGrants,
        totalFreeCoinsMinted,
        mintFreeCoins,
        deleteFreeCoinGrant,
        appConfig,
        updateAppConfig,
        testAppPing,
        staffApplications,
        submitStaffApplication,
        approveStaffApplication,
        rejectStaffApplication,
        deleteStaffApplication,
        dossierTargetAppId,
        setDossierTargetAppId,
        onboardingModalOpen,
        setOnboardingModalOpen,
        onboardingTargetRole,
        setOnboardingTargetRole,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetAllData,
        setWebsiteTheme,
        renameTab,
        resetTabNames,
        addCustomSection,
        updateCustomSection,
        deleteCustomSection,
        setPopupNotice,
        applyFullDatabaseJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
