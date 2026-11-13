-- =============================================================================
-- RB STAR Voice Chat Room - InfinityFree MySQL / MariaDB Database Schema
-- =============================================================================
-- Instructions:
-- 1. Log into InfinityFree Client Area -> Control Panel (vPanel) -> MySQL Databases
-- 2. Create a database (e.g. if0_38492011_rbstar)
-- 3. Open phpMyAdmin for that database
-- 4. Select your database in the left sidebar, click "Import", choose this file, and click "Go"
-- Note: Do NOT add CREATE DATABASE or USE statements; phpMyAdmin selects your DB automatically.
-- =============================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1. Portal Authentication (Hashed Master Password)
CREATE TABLE IF NOT EXISTS `portal_auth` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Brute-Force Login Protection Table
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `ip_address` VARCHAR(64) NOT NULL,
  `attempts` INT UNSIGNED NOT NULL DEFAULT 0,
  `locked_until` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `last_attempt_at` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Portal Settings & Website Config (Theme, Branding, Tab Renames, Popup Notice, Custom Sections)
CREATE TABLE IF NOT EXISTS `portal_settings` (
  `setting_key` VARCHAR(100) NOT NULL,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. App Admins & Staff
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `app_id` VARCHAR(64) NOT NULL,
  `role` VARCHAR(40) NOT NULL,
  `country` VARCHAR(100) DEFAULT '',
  `phone` VARCHAR(64) DEFAULT '',
  `whatsapp` VARCHAR(64) DEFAULT '',
  `avatar` TEXT,
  `cnic_number` VARCHAR(64) DEFAULT '',
  `cnic_front_image` LONGTEXT,
  `cnic_back_image` LONGTEXT,
  `city` VARCHAR(100) DEFAULT '',
  `appointment_code` VARCHAR(80) DEFAULT '',
  `documents_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(32) NOT NULL DEFAULT 'active',
  `level_title` VARCHAR(120) DEFAULT '',
  `joined_date` VARCHAR(32) DEFAULT '',
  `badge_title` VARCHAR(120) DEFAULT '',
  `notes` TEXT,
  `assigned_admin_id` VARCHAR(64) DEFAULT '',
  `assigned_admin_name` VARCHAR(160) DEFAULT '',
  `assigned_bd_ids` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_app_id` (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Official Coin Resellers
CREATE TABLE IF NOT EXISTS `coin_resellers` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `reseller_code` VARCHAR(64) NOT NULL,
  `app_id` VARCHAR(64) NOT NULL,
  `country` VARCHAR(100) DEFAULT '',
  `avatar` TEXT,
  `whatsapp_number` VARCHAR(64) DEFAULT '',
  `telegram` VARCHAR(100) DEFAULT '',
  `rating` DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  `coins_available` BIGINT NOT NULL DEFAULT 0,
  `total_coins_sold` BIGINT NOT NULL DEFAULT 0,
  `payment_methods` TEXT,
  `status` VARCHAR(40) NOT NULL DEFAULT 'verified_official',
  `verified_since` VARCHAR(32) DEFAULT '',
  `discount_rate` VARCHAR(160) DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reseller_app_id` (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Coin Packages (Store & Bulk Price Adjuster)
CREATE TABLE IF NOT EXISTS `coin_packages` (
  `id` VARCHAR(64) NOT NULL,
  `coins` BIGINT NOT NULL DEFAULT 0,
  `bonus_coins` BIGINT NOT NULL DEFAULT 0,
  `price_pkr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `price_usd` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `price_inr` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `badge` VARCHAR(80) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Showcase Screenshots (Public Slider & Double Marquee)
CREATE TABLE IF NOT EXISTS `app_screenshots` (
  `id` VARCHAR(64) NOT NULL,
  `src` TEXT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT '',
  `badge` VARCHAR(100) DEFAULT '',
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Live Voice Rooms
CREATE TABLE IF NOT EXISTS `voice_rooms` (
  `id` VARCHAR(64) NOT NULL,
  `room_number` VARCHAR(64) NOT NULL,
  `room_name` VARCHAR(200) NOT NULL,
  `category` VARCHAR(64) NOT NULL DEFAULT 'chat',
  `host_app_id` VARCHAR(64) NOT NULL,
  `host_name` VARCHAR(160) NOT NULL,
  `host_avatar` TEXT,
  `listeners_count` INT NOT NULL DEFAULT 0,
  `mic_seats` LONGTEXT,
  `is_locked` TINYINT(1) NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `country` VARCHAR(100) DEFAULT '',
  `hot_score` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Talent Agencies & Host Rosters
CREATE TABLE IF NOT EXISTS `agencies` (
  `id` VARCHAR(64) NOT NULL,
  `agency_code` VARCHAR(64) NOT NULL,
  `agency_name` VARCHAR(200) NOT NULL,
  `owner_name` VARCHAR(160) NOT NULL,
  `owner_app_id` VARCHAR(64) NOT NULL,
  `contact_whatsapp` VARCHAR(64) DEFAULT '',
  `country` VARCHAR(100) DEFAULT '',
  `total_hosts` INT NOT NULL DEFAULT 0,
  `monthly_diamonds` BIGINT NOT NULL DEFAULT 0,
  `target_hours` INT NOT NULL DEFAULT 0,
  `commission_percent` DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  `status` VARCHAR(40) NOT NULL DEFAULT 'active',
  `hosts_json` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. BD Managers
CREATE TABLE IF NOT EXISTS `bd_managers` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `bd_code` VARCHAR(64) NOT NULL,
  `app_id` VARCHAR(64) NOT NULL,
  `region` VARCHAR(100) DEFAULT '',
  `phone` VARCHAR(64) DEFAULT '',
  `whatsapp` VARCHAR(64) DEFAULT '',
  `avatar` TEXT,
  `cnic_number` VARCHAR(64) DEFAULT '',
  `cnic_front_image` LONGTEXT,
  `cnic_back_image` LONGTEXT,
  `city` VARCHAR(100) DEFAULT '',
  `appointment_code` VARCHAR(80) DEFAULT '',
  `documents_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `joined_date` VARCHAR(32) DEFAULT '',
  `assigned_admin_id` VARCHAR(64) DEFAULT '',
  `assigned_admin_name` VARCHAR(160) DEFAULT '',
  `total_agencies_recruited` INT NOT NULL DEFAULT 0,
  `target_monthly_diamonds` BIGINT NOT NULL DEFAULT 0,
  `achieved_diamonds` BIGINT NOT NULL DEFAULT 0,
  `commission_earned_usd` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` VARCHAR(32) NOT NULL DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `idx_bd_app_id` (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Customer Support Tickets
CREATE TABLE IF NOT EXISTS `support_tickets` (
  `id` VARCHAR(64) NOT NULL,
  `ticket_number` VARCHAR(64) NOT NULL,
  `user_app_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(160) NOT NULL,
  `user_avatar` TEXT,
  `subject` VARCHAR(255) NOT NULL,
  `category` VARCHAR(64) NOT NULL,
  `priority` VARCHAR(32) NOT NULL DEFAULT 'medium',
  `status` VARCHAR(32) NOT NULL DEFAULT 'open',
  `assigned_cs_name` VARCHAR(160) DEFAULT '',
  `created_at` VARCHAR(64) DEFAULT '',
  `last_reply` VARCHAR(64) DEFAULT '',
  `description` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Paid Coin Reseller Transactions
CREATE TABLE IF NOT EXISTS `coin_transactions` (
  `id` VARCHAR(64) NOT NULL,
  `receipt_number` VARCHAR(80) NOT NULL,
  `reseller_id` VARCHAR(64) NOT NULL,
  `reseller_name` VARCHAR(160) NOT NULL,
  `buyer_app_id` VARCHAR(64) NOT NULL,
  `buyer_name` VARCHAR(160) NOT NULL,
  `coins_amount` BIGINT NOT NULL DEFAULT 0,
  `bonus_amount` BIGINT NOT NULL DEFAULT 0,
  `total_paid` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `currency` VARCHAR(16) NOT NULL DEFAULT 'PKR',
  `payment_method` VARCHAR(100) DEFAULT '',
  `timestamp_label` VARCHAR(64) DEFAULT '',
  `status` VARCHAR(32) NOT NULL DEFAULT 'completed',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Free Coins Mint Ledger (Strictly Separate from Paid Purchases)
CREATE TABLE IF NOT EXISTS `free_coin_grants` (
  `id` VARCHAR(64) NOT NULL,
  `grant_code` VARCHAR(80) NOT NULL,
  `receiver_app_id` VARCHAR(64) NOT NULL,
  `receiver_name` VARCHAR(160) NOT NULL,
  `coins_amount` BIGINT NOT NULL DEFAULT 0,
  `category` VARCHAR(64) NOT NULL DEFAULT 'owner_unlimited_mint',
  `notes` TEXT,
  `granted_by` VARCHAR(120) DEFAULT 'Super Admin Owner',
  `timestamp_label` VARCHAR(64) DEFAULT '',
  `status` VARCHAR(32) NOT NULL DEFAULT 'minted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Banned App Users
CREATE TABLE IF NOT EXISTS `banned_users` (
  `id` VARCHAR(64) NOT NULL,
  `app_id` VARCHAR(64) NOT NULL,
  `user_name` VARCHAR(160) NOT NULL,
  `avatar` TEXT,
  `ban_type` VARCHAR(64) NOT NULL DEFAULT 'permanent_ban',
  `reason` TEXT,
  `banned_by` VARCHAR(120) DEFAULT 'Super Admin',
  `banned_at` VARCHAR(64) DEFAULT '',
  `expires_at` VARCHAR(64) DEFAULT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'banned',
  PRIMARY KEY (`id`),
  KEY `idx_banned_app_id` (`app_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Public Staff Onboarding Applications
CREATE TABLE IF NOT EXISTS `staff_applications` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `app_id` VARCHAR(64) NOT NULL,
  `role` VARCHAR(40) NOT NULL,
  `assigned_admin_id` VARCHAR(64) DEFAULT '',
  `assigned_admin_name` VARCHAR(160) DEFAULT '',
  `phone` VARCHAR(64) NOT NULL,
  `whatsapp` VARCHAR(64) DEFAULT '',
  `cnic_number` VARCHAR(64) NOT NULL,
  `city` VARCHAR(100) DEFAULT '',
  `avatar` LONGTEXT,
  `cnic_front_image` LONGTEXT,
  `cnic_back_image` LONGTEXT,
  `notes` TEXT,
  `submitted_at` VARCHAR(64) DEFAULT '',
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. System Broadcasts
CREATE TABLE IF NOT EXISTS `broadcasts` (
  `id` VARCHAR(64) NOT NULL,
  `message` TEXT NOT NULL,
  `sender` VARCHAR(120) NOT NULL DEFAULT 'Super Admin',
  `timestamp_label` VARCHAR(64) DEFAULT '',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Default Seed Data
-- =============================================================================

-- Default password is 'admin' (automatically upgraded to BCRYPT hash on first PHP login)
INSERT IGNORE INTO `portal_auth` (`id`, `username`, `password_hash`)
VALUES (1, 'master_owner', 'INIT_DEFAULT_ADMIN');

INSERT IGNORE INTO `coin_packages` (`id`, `coins`, `bonus_coins`, `price_pkr`, `price_usd`, `price_inr`, `badge`, `sort_order`) VALUES
('pkg-1', 10000, 500, 350.00, 1.25, 105.00, 'Starter', 1),
('pkg-2', 50000, 3500, 1700.00, 6.10, 510.00, 'Popular', 2),
('pkg-3', 100000, 10000, 3350.00, 11.99, 999.00, 'VIP Choice', 3),
('pkg-4', 500000, 65000, 16500.00, 59.00, 4900.00, 'Mega Bundle', 4),
('pkg-5', 1000000, 150000, 32500.00, 115.00, 9600.00, 'Whale Crown 👑', 5);

INSERT IGNORE INTO `app_screenshots` (`id`, `src`, `title`, `category`, `badge`, `sort_order`) VALUES
('shot-1', '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.33_PM__1__cc4e13c3.jpeg', 'Welcome to RB Star & Star Member Profile', 'Home & Profile', '👑 Official UI', 1),
('shot-2', '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.33_PM_6baa2cd3.jpeg', '4-Screen Complete App Tour: Audio Rooms, Stage & Live Roses', 'Full App Tour', '⭐ Audio Rooms', 2),
('shot-3', '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.32_PM__1__2caea900.jpeg', 'Voice Chat Party, Room Seats & 3D Gift Animations', 'Party & Gifts', '🎁 Live Gifts', 3),
('shot-4', '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.32_PM_4de9e7db.jpeg', 'Live Voice Room & 3D Luxury Sports Car Gift Effect', 'Live Voice Room', '🏎️ 3D Supercar Gift', 4),
('shot-5', '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.31_PM__1__c12204d5.jpeg', 'Stage Host, Co-Hosts, Audio Waves & 3D Flower Gifts', 'Mic Stage PK', '🌹 Stage PK', 5),
('shot-6', '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.34_PM_5b476677.jpeg', 'Party Rooms, SVIP Privileges, Coins & Diamonds Wallet', 'Wallet & SVIP', '💎 Coins & VIP', 6),
('shot-7', '/assets/aistudio/WhatsApp_Image_2026-11-11_at_11.17.31_PM_0efaea4b.jpeg', 'Rank No.1 Voice Room, VIP Guests & Rose Sending Animation', 'Rankings & VIP', '🏆 Rank #1 Room', 7);

INSERT IGNORE INTO `portal_settings` (`setting_key`, `setting_value`) VALUES
('app_config', '{"appName":"RB STAR Voice Chat Room","appLogo":"/assets/aistudio/WhatsApp_Image_2026-11-10_at_8.07.38_AM_9cc28500.jpeg","appSlogan":"Official Voice Chat Room Ecosystem & Management Portal","heroDescription":"Official Voice Chat Room In-App Showcase & Live Interface Preview","tickerText":"Official Directory for Voice Chat App Admins, Verified Resellers, Agencies & CS","officialBadge":"👑 OFFICIAL","footerText":"RB STAR Voice Chat Room Official Ecosystem","footerSubtext":"Client Encrypted • All In-App Rights Reserved","supportWhatsApp":"+92 311 2486463","supportTelegram":"@RBStarOfficial","supportEmail":"contact@rbstarvoice.com","appPackageId":"com.rbstar.voicechat.room","webhookUrl":"/api/webhook.php","apiKey":"rbstar_live_key_change_in_panel","syncIntervalSeconds":30,"serverStatus":"connected","lastPingMs":20,"lastSyncedAt":"Live","totalApiRequests":0,"theme":"royal_purple","sliderSpeedSeconds":3.5,"showMarquee":true,"showTicker":true,"diamondToUsdRate":10000,"tabRenames":{},"customSections":[{"id":"sec-1","title":"Official Voice App Community Guidelines","content":"RB STAR provides high quality voice chat rooms with verified mic hosts, PK battles, and secure coin exchange. Respect all hosts and members in party rooms.","badge":"📜 Rules","category":"Guidelines","showInPublic":true},{"id":"sec-2","title":"Talent Agency Diamonds & Host Commission Target","content":"Agency hosts receive monthly diamond payouts based on valid live hours and PK battle victory targets. Diamond settlements are issued on the 1st of every month.","badge":"💎 Policy","category":"Agency","showInPublic":false}],"popupNotice":{"enabled":false,"title":"📢 Official Announcement","message":"Welcome to the official RB STAR voice ecosystem portal!","badge":"NOTICE"}}');
