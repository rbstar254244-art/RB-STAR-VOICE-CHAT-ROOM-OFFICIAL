export type UserRole = 
  | 'super_admin' 
  | 'admin' // Simple Admin
  | 'cs' 
  | 'bd' 
  | 'agency_manager' 
  | 'coin_reseller';

export interface BannedUser {
  id: string;
  appId: string;
  userName: string;
  avatar?: string;
  banType: 'permanent_ban' | 'temporary_ban' | 'voice_mute_24h' | 'device_ban';
  reason: string;
  bannedBy: string;
  bannedAt: string;
  expiresAt?: string;
  status: 'banned' | 'unbanned';
}

export interface AdminUser {
  id: string;
  name: string;
  appId: string; // The In-App user ID (e.g. 10001, 78601)
  role: UserRole;
  country: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  cnicNumber?: string; // National ID e.g. "35201-1234567-1"
  cnicFrontImage?: string; // Photo of front side of CNIC
  cnicBackImage?: string; // Photo of back side of CNIC
  city?: string;
  appointmentCode?: string; // Unique verification serial e.g. "RB-ADM-84920"
  documentsVerified?: boolean;
  status: 'active' | 'suspended';
  level: string; // e.g. "Level 9 Super Admin", "Chief CS", "Regional BD Lead"
  joinedDate: string;
  badgeTitle: string;
  notes?: string;
  assignedAdminId?: string; // If this is a BD, which Simple Admin they report to
  assignedAdminName?: string;
  assignedBdIds?: string[]; // If this is a Simple Admin, list of BD IDs under them
}

export interface StaffApplication {
  id: string;
  name: string;
  appId: string;
  role: 'admin' | 'bd' | 'super_admin';
  assignedAdminId?: string;
  assignedAdminName?: string;
  phone: string;
  whatsapp: string;
  cnicNumber: string;
  city: string;
  avatar: string;
  cnicFrontImage?: string;
  cnicBackImage?: string;
  notes?: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CoinPackage {
  id: string;
  coins: number;
  bonusCoins: number;
  pricePKR: number;
  priceUSD: number;
  priceINR: number;
  badge?: string;
}

export interface CoinReseller {
  id: string;
  name: string;
  resellerCode: string; // e.g. "CR-PK01"
  appId: string;
  country: string;
  avatar: string;
  whatsappNumber: string;
  telegram?: string;
  rating: number; // e.g. 4.9
  coinsAvailable: number;
  totalCoinsSold: number;
  paymentMethods: string[]; // ['JazzCash', 'Easypaisa', 'Bank Transfer', 'Binance USDT']
  status: 'verified_official' | 'pending' | 'suspended';
  verifiedSince: string;
  discountRate: string; // e.g. "5% Extra Coins on Bulk"
}

export interface MicSeat {
  seatIndex: number;
  occupantAppId?: string;
  occupantName?: string;
  avatar?: string;
  isMuted: boolean;
  isLocked: boolean;
  isTalking: boolean;
  gender?: 'male' | 'female';
}

export interface VoiceRoom {
  id: string;
  roomNumber: string; // e.g. 889211
  roomName: string;
  category: 'singing' | 'chat' | 'gaming' | 'poetry' | 'vip' | 'party';
  hostAppId: string;
  hostName: string;
  hostAvatar: string;
  listenersCount: number;
  micSeats: MicSeat[];
  isLocked: boolean;
  isFeatured: boolean;
  country: string;
  hotScore: number;
}

export interface HostMember {
  id: string;
  appId: string;
  name: string;
  avatar: string;
  gender: 'female' | 'male';
  liveHoursThisMonth: number;
  diamondsEarned: number;
  status: 'live' | 'offline';
  joinedDate: string;
}

export interface Agency {
  id: string;
  agencyCode: string; // e.g. "AG-109"
  agencyName: string;
  ownerName: string;
  ownerAppId: string;
  contactWhatsapp: string;
  country: string;
  totalHosts: number;
  monthlyDiamonds: number;
  targetHours: number;
  commissionPercent: number; // e.g. 15%
  status: 'active' | 'probation' | 'pending';
  hosts: HostMember[];
}

export interface BDManager {
  id: string;
  name: string;
  bdCode: string; // e.g. "BD-ASIA-01"
  appId: string;
  region: string;
  phone: string;
  whatsapp: string;
  avatar?: string;
  cnicNumber?: string;
  cnicFrontImage?: string;
  cnicBackImage?: string;
  city?: string;
  appointmentCode?: string;
  documentsVerified?: boolean;
  joinedDate?: string;
  assignedAdminId?: string; // Simple Admin reporting to
  assignedAdminName?: string;
  totalAgenciesRecruited: number;
  targetMonthlyDiamonds: number;
  achievedDiamonds: number;
  commissionEarnedUSD: number;
  status: 'active' | 'inactive';
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userAppId: string;
  userName: string;
  userAvatar: string;
  subject: string;
  category: 'coin_fraud' | 'ban_appeal' | 'mic_harassment' | 'account_issue' | 'reseller_inquiry';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved';
  assignedCsName?: string;
  createdAt: string;
  lastReply: string;
  description: string;
}

export interface CoinTransaction {
  id: string;
  receiptNumber: string;
  resellerId: string;
  resellerName: string;
  buyerAppId: string;
  buyerName: string;
  coinsAmount: number;
  bonusAmount: number;
  totalPaid: number;
  currency: string;
  paymentMethod: string;
  timestamp: string;
  status: 'completed' | 'flagged' | 'refunded';
}

export interface AppScreenshot {
  id: string;
  src: string;
  title: string;
  category: string;
  badge: string;
}

export type WebsiteTheme = 
  | 'royal_purple' 
  | 'cyber_blue' 
  | 'emerald_gold' 
  | 'crimson_vip' 
  | 'stealth_dark' 
  | 'sunset_amber';

export interface TabRenameMap {
  overview?: string;
  site_editor?: string;
  free_coins?: string;
  resellers?: string;
  admins?: string;
  cs?: string;
  bd?: string;
  agencies?: string;
  verification?: string;
  connect?: string;
  settings?: string;
  custom_pages?: string;
}

export interface CustomPageSection {
  id: string;
  title: string;
  content: string;
  badge?: string;
  category?: string;
  showInPublic?: boolean;
}

export interface AppConnectionConfig {
  appName: string;
  appLogo?: string;
  appSlogan?: string;
  heroDescription?: string;
  tickerText?: string;
  officialBadge?: string;
  footerText?: string;
  footerSubtext?: string;
  supportWhatsApp?: string;
  supportTelegram?: string;
  supportEmail?: string;
  appPackageId: string;
  webhookUrl: string;
  apiKey: string;
  syncIntervalSeconds: number;
  serverStatus: 'connected' | 'connecting' | 'disconnected';
  lastPingMs: number;
  lastSyncedAt: string;
  totalApiRequests: number;
  
  // Full Website Customization
  theme: WebsiteTheme;
  sliderSpeedSeconds?: number;
  showMarquee?: boolean;
  showTicker?: boolean;
  diamondToUsdRate?: number;
  tabRenames?: TabRenameMap;
  customSections?: CustomPageSection[];
  popupNotice?: {
    enabled: boolean;
    title: string;
    message: string;
    badge?: string;
  };
}

export interface FreeCoinGrant {
  id: string;
  grantCode: string;
  receiverAppId: string;
  receiverName: string;
  coinsAmount: number;
  category: 'owner_unlimited_mint' | 'host_bonus' | 'vip_reward' | 'event_giveaway' | 'custom_grant';
  notes?: string;
  grantedBy: string;
  timestamp: string;
  status: 'minted' | 'delivered';
}
