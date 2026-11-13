import { AdminUser, CoinReseller, VoiceRoom, Agency, BDManager, SupportTicket, CoinPackage, CoinTransaction, AppConnectionConfig, BannedUser, StaffApplication, AppScreenshot } from '../types';

export const INITIAL_MASTER_PASSWORD = 'admin'; // Owner password (can be changed to any custom password)

export const INITIAL_STAFF_APPLICATIONS: StaffApplication[] = [];

export const INITIAL_COIN_PACKAGES: CoinPackage[] = [
  { id: 'pkg-1', coins: 10000, bonusCoins: 500, pricePKR: 350, priceUSD: 1.25, priceINR: 105, badge: 'Starter' },
  { id: 'pkg-2', coins: 50000, bonusCoins: 3500, pricePKR: 1700, priceUSD: 6.10, priceINR: 510, badge: 'Popular' },
  { id: 'pkg-3', coins: 100000, bonusCoins: 10000, pricePKR: 3350, priceUSD: 11.99, priceINR: 999, badge: 'VIP Choice' },
  { id: 'pkg-4', coins: 500000, bonusCoins: 65000, pricePKR: 16500, priceUSD: 59.00, priceINR: 4900, badge: 'Mega Bundle' },
  { id: 'pkg-5', coins: 1000000, bonusCoins: 150000, pricePKR: 32500, priceUSD: 115.00, priceINR: 9600, badge: 'Whale Crown 👑' },
];

// No dummy staff - Only staff registered by the owner will appear here
export const INITIAL_ADMIN_USERS: AdminUser[] = [];

// No dummy banned users
export const INITIAL_BANNED_USERS: BannedUser[] = [];

// No dummy resellers - Only resellers registered by the owner will appear here
export const INITIAL_RESELLERS: CoinReseller[] = [];

// No dummy rooms
export const INITIAL_VOICE_ROOMS: VoiceRoom[] = [];

// No dummy agencies
export const INITIAL_AGENCIES: Agency[] = [];

// No dummy BDs
export const INITIAL_BDS: BDManager[] = [];

// No dummy tickets
export const INITIAL_TICKETS: SupportTicket[] = [];

// No dummy transactions
export const INITIAL_TRANSACTIONS: CoinTransaction[] = [];

export const INITIAL_APP_SCREENSHOTS: AppScreenshot[] = [
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

export const INITIAL_APP_CONFIG: AppConnectionConfig = {
  appName: 'RB STAR Voice Chat Room',
  appLogo: '/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg',
  appSlogan: 'Official Voice Chat Room Ecosystem & Management Portal',
  heroDescription: 'Official Voice Chat Room In-App Showcase & Live Interface Preview',
  tickerText: 'Official Directory for Voice Chat App Admins, Verified Resellers, Agencies & CS',
  officialBadge: '👑 OFFICIAL',
  footerText: 'RB STAR Voice Chat Room Official Ecosystem',
  footerSubtext: 'Client Encrypted • All In-App Rights Reserved',
  supportWhatsApp: '+92 311 2486463',
  supportTelegram: '@RBStarOfficial',
  supportEmail: 'contact@rbstarvoice.com',
  appPackageId: 'com.rbstar.voicechat.room',
  webhookUrl: '',
  apiKey: '',
  syncIntervalSeconds: 30,
  serverStatus: 'connected',
  lastPingMs: 20,
  lastSyncedAt: 'Live',
  totalApiRequests: 0,
  theme: 'royal_purple',
  sliderSpeedSeconds: 3.5,
  showMarquee: true,
  showTicker: true,
  diamondToUsdRate: 10000, // 10,000 diamonds = $1 USD
  tabRenames: {},
  customSections: [
    {
      id: 'sec-1',
      title: 'Official Voice App Community Guidelines',
      content: 'RB STAR provides high quality voice chat rooms with verified mic hosts, PK battles, and secure coin exchange. Respect all hosts and members in party rooms.',
      badge: '📜 Rules',
      category: 'Guidelines',
      showInPublic: true
    },
    {
      id: 'sec-2',
      title: 'Talent Agency Diamonds & Host Commission Target',
      content: 'Agency hosts receive monthly diamond payouts based on valid live hours and PK battle victory targets. Diamond settlements are issued on the 1st of every month.',
      badge: '💎 Policy',
      category: 'Agency',
      showInPublic: false
    }
  ],
  popupNotice: {
    enabled: false,
    title: '📢 Official Announcement',
    message: 'Welcome to the official RB STAR voice ecosystem portal!',
    badge: 'NOTICE'
  }
};
