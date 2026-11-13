<?php
/**
 * =============================================================================
 * RB STAR Voice Chat Room - Authenticated Admin MySQL Sync API (InfinityFree)
 * =============================================================================
 */

require_once __DIR__ . '/config.php';
requireAuth();

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    // 1. appConfig
    $cfgStmt = $pdo->prepare('SELECT setting_value FROM portal_settings WHERE setting_key = ? LIMIT 1');
    $cfgStmt->execute(['app_config']);
    $cfgJson = $cfgStmt->fetchColumn();
    $appConfig = $cfgJson ? json_decode($cfgJson, true) : null;

    // 2. coinPackages
    $coinPackages = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'coins' => (int)$r['coins'],
            'bonusCoins' => (int)$r['bonus_coins'],
            'pricePKR' => (float)$r['price_pkr'],
            'priceUSD' => (float)$r['price_usd'],
            'priceINR' => (float)$r['price_inr'],
            'badge' => $r['badge'] ?: null,
        ];
    }, $pdo->query('SELECT * FROM coin_packages ORDER BY sort_order ASC')->fetchAll());

    // 3. screenshots
    $screenshots = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'src' => $r['src'],
            'title' => $r['title'],
            'category' => $r['category'],
            'badge' => $r['badge'],
        ];
    }, $pdo->query('SELECT * FROM app_screenshots ORDER BY sort_order ASC')->fetchAll());

    // 4. adminUsers
    $adminUsers = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'name' => $r['name'],
            'appId' => $r['app_id'],
            'role' => $r['role'],
            'country' => $r['country'],
            'phone' => $r['phone'],
            'whatsapp' => $r['whatsapp'],
            'avatar' => $r['avatar'],
            'cnicNumber' => $r['cnic_number'] ?: null,
            'cnicFrontImage' => $r['cnic_front_image'] ?: null,
            'cnicBackImage' => $r['cnic_back_image'] ?: null,
            'city' => $r['city'] ?: null,
            'appointmentCode' => $r['appointment_code'] ?: null,
            'documentsVerified' => (bool)$r['documents_verified'],
            'status' => $r['status'],
            'level' => $r['level_title'],
            'joinedDate' => $r['joined_date'],
            'badgeTitle' => $r['badge_title'],
            'notes' => $r['notes'] ?: null,
            'assignedAdminId' => $r['assigned_admin_id'] ?: null,
            'assignedAdminName' => $r['assigned_admin_name'] ?: null,
            'assignedBdIds' => $r['assigned_bd_ids'] ? json_decode($r['assigned_bd_ids'], true) : [],
        ];
    }, $pdo->query('SELECT * FROM admin_users ORDER BY created_at DESC')->fetchAll());

    // 5. coinResellers
    $coinResellers = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'name' => $r['name'],
            'resellerCode' => $r['reseller_code'],
            'appId' => $r['app_id'],
            'country' => $r['country'],
            'avatar' => $r['avatar'],
            'whatsappNumber' => $r['whatsapp_number'],
            'telegram' => $r['telegram'] ?: null,
            'rating' => (float)$r['rating'],
            'coinsAvailable' => (int)$r['coins_available'],
            'totalCoinsSold' => (int)$r['total_coins_sold'],
            'paymentMethods' => $r['payment_methods'] ? json_decode($r['payment_methods'], true) : [],
            'status' => $r['status'],
            'verifiedSince' => $r['verified_since'],
            'discountRate' => $r['discount_rate'],
        ];
    }, $pdo->query('SELECT * FROM coin_resellers ORDER BY created_at DESC')->fetchAll());

    // 6. voiceRooms
    $voiceRooms = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'roomNumber' => $r['room_number'],
            'roomName' => $r['room_name'],
            'category' => $r['category'],
            'hostAppId' => $r['host_app_id'],
            'hostName' => $r['host_name'],
            'hostAvatar' => $r['host_avatar'],
            'listenersCount' => (int)$r['listeners_count'],
            'micSeats' => $r['mic_seats'] ? json_decode($r['mic_seats'], true) : [],
            'isLocked' => (bool)$r['is_locked'],
            'isFeatured' => (bool)$r['is_featured'],
            'country' => $r['country'],
            'hotScore' => (int)$r['hot_score'],
        ];
    }, $pdo->query('SELECT * FROM voice_rooms')->fetchAll());

    // 7. agencies
    $agencies = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'agencyCode' => $r['agency_code'],
            'agencyName' => $r['agency_name'],
            'ownerName' => $r['owner_name'],
            'ownerAppId' => $r['owner_app_id'],
            'contactWhatsapp' => $r['contact_whatsapp'],
            'country' => $r['country'],
            'totalHosts' => (int)$r['total_hosts'],
            'monthlyDiamonds' => (int)$r['monthly_diamonds'],
            'targetHours' => (int)$r['target_hours'],
            'commissionPercent' => (float)$r['commission_percent'],
            'status' => $r['status'],
            'hosts' => $r['hosts_json'] ? json_decode($r['hosts_json'], true) : [],
        ];
    }, $pdo->query('SELECT * FROM agencies')->fetchAll());

    // 8. bdManagers
    $bdManagers = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'name' => $r['name'],
            'bdCode' => $r['bd_code'],
            'appId' => $r['app_id'],
            'region' => $r['region'],
            'phone' => $r['phone'],
            'whatsapp' => $r['whatsapp'],
            'avatar' => $r['avatar'] ?: null,
            'cnicNumber' => $r['cnic_number'] ?: null,
            'cnicFrontImage' => $r['cnic_front_image'] ?: null,
            'cnicBackImage' => $r['cnic_back_image'] ?: null,
            'city' => $r['city'] ?: null,
            'appointmentCode' => $r['appointment_code'] ?: null,
            'documentsVerified' => (bool)$r['documents_verified'],
            'joinedDate' => $r['joined_date'] ?: null,
            'assignedAdminId' => $r['assigned_admin_id'] ?: null,
            'assignedAdminName' => $r['assigned_admin_name'] ?: null,
            'totalAgenciesRecruited' => (int)$r['total_agencies_recruited'],
            'targetMonthlyDiamonds' => (int)$r['target_monthly_diamonds'],
            'achievedDiamonds' => (int)$r['achieved_diamonds'],
            'commissionEarnedUSD' => (float)$r['commission_earned_usd'],
            'status' => $r['status'],
        ];
    }, $pdo->query('SELECT * FROM bd_managers')->fetchAll());

    // 9. tickets
    $tickets = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'ticketNumber' => $r['ticket_number'],
            'userAppId' => $r['user_app_id'],
            'userName' => $r['user_name'],
            'userAvatar' => $r['user_avatar'],
            'subject' => $r['subject'],
            'category' => $r['category'],
            'priority' => $r['priority'],
            'status' => $r['status'],
            'assignedCsName' => $r['assigned_cs_name'] ?: null,
            'createdAt' => $r['created_at'],
            'lastReply' => $r['last_reply'],
            'description' => $r['description'],
        ];
    }, $pdo->query('SELECT * FROM support_tickets')->fetchAll());

    // 10. transactions
    $transactions = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'receiptNumber' => $r['receipt_number'],
            'resellerId' => $r['reseller_id'],
            'resellerName' => $r['reseller_name'],
            'buyerAppId' => $r['buyer_app_id'],
            'buyerName' => $r['buyer_name'],
            'coinsAmount' => (int)$r['coins_amount'],
            'bonusAmount' => (int)$r['bonus_amount'],
            'totalPaid' => (float)$r['total_paid'],
            'currency' => $r['currency'],
            'paymentMethod' => $r['payment_method'],
            'timestamp' => $r['timestamp_label'],
            'status' => $r['status'],
        ];
    }, $pdo->query('SELECT * FROM coin_transactions')->fetchAll());

    // 11. freeCoinGrants
    $freeCoinGrants = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'grantCode' => $r['grant_code'],
            'receiverAppId' => $r['receiver_app_id'],
            'receiverName' => $r['receiver_name'],
            'coinsAmount' => (int)$r['coins_amount'],
            'category' => $r['category'],
            'notes' => $r['notes'] ?: null,
            'grantedBy' => $r['granted_by'],
            'timestamp' => $r['timestamp_label'],
            'status' => $r['status'],
        ];
    }, $pdo->query('SELECT * FROM free_coin_grants')->fetchAll());

    // 12. bannedUsers
    $bannedUsers = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'appId' => $r['app_id'],
            'userName' => $r['user_name'],
            'avatar' => $r['avatar'] ?: null,
            'banType' => $r['ban_type'],
            'reason' => $r['reason'],
            'bannedBy' => $r['banned_by'],
            'bannedAt' => $r['banned_at'],
            'expiresAt' => $r['expires_at'] ?: null,
            'status' => $r['status'],
        ];
    }, $pdo->query('SELECT * FROM banned_users')->fetchAll());

    // 13. staffApplications
    $staffApplications = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'name' => $r['name'],
            'appId' => $r['app_id'],
            'role' => $r['role'],
            'assignedAdminId' => $r['assigned_admin_id'] ?: null,
            'assignedAdminName' => $r['assigned_admin_name'] ?: null,
            'phone' => $r['phone'],
            'whatsapp' => $r['whatsapp'],
            'cnicNumber' => $r['cnic_number'],
            'city' => $r['city'],
            'avatar' => $r['avatar'],
            'cnicFrontImage' => $r['cnic_front_image'] ?: null,
            'cnicBackImage' => $r['cnic_back_image'] ?: null,
            'notes' => $r['notes'] ?: null,
            'submittedAt' => $r['submitted_at'],
            'status' => $r['status'],
        ];
    }, $pdo->query('SELECT * FROM staff_applications')->fetchAll());

    // 14. broadcasts
    $broadcasts = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'message' => $r['message'],
            'sender' => $r['sender'],
            'timestamp' => $r['timestamp_label'],
        ];
    }, $pdo->query('SELECT * FROM broadcasts ORDER BY created_at DESC LIMIT 50')->fetchAll());

    sendJson([
        'ok' => true,
        'data' => [
            'appConfig' => $appConfig,
            'coinPackages' => $coinPackages,
            'screenshots' => $screenshots,
            'adminUsers' => $adminUsers,
            'coinResellers' => $coinResellers,
            'voiceRooms' => $voiceRooms,
            'agencies' => $agencies,
            'bdManagers' => $bdManagers,
            'tickets' => $tickets,
            'transactions' => $transactions,
            'freeCoinGrants' => $freeCoinGrants,
            'bannedUsers' => $bannedUsers,
            'staffApplications' => $staffApplications,
            'broadcasts' => $broadcasts,
        ]
    ]);
}

if ($method === 'POST') {
    $body = getJsonBody();

    try {
        $pdo->beginTransaction();

        if (isset($body['appConfig']) && is_array($body['appConfig'])) {
            $stmt = $pdo->prepare(
                'INSERT INTO portal_settings (setting_key, setting_value) VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
            );
            $stmt->execute(['app_config', json_encode($body['appConfig'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
        }

        if (isset($body['coinPackages']) && is_array($body['coinPackages'])) {
            $pdo->exec('DELETE FROM coin_packages');
            $stmt = $pdo->prepare(
                'INSERT INTO coin_packages (id, coins, bonus_coins, price_pkr, price_usd, price_inr, badge, sort_order)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach (array_values($body['coinPackages']) as $idx => $p) {
                $stmt->execute([
                    (string)($p['id'] ?? ('pkg-' . $idx)),
                    (int)($p['coins'] ?? 0),
                    (int)($p['bonusCoins'] ?? 0),
                    (float)($p['pricePKR'] ?? 0),
                    (float)($p['priceUSD'] ?? 0),
                    (float)($p['priceINR'] ?? 0),
                    $p['badge'] ?? null,
                    $idx + 1,
                ]);
            }
        }

        if (isset($body['screenshots']) && is_array($body['screenshots'])) {
            $pdo->exec('DELETE FROM app_screenshots');
            $stmt = $pdo->prepare(
                'INSERT INTO app_screenshots (id, src, title, category, badge, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
            );
            foreach (array_values($body['screenshots']) as $idx => $s) {
                $stmt->execute([
                    (string)($s['id'] ?? ('shot-' . $idx)),
                    (string)($s['src'] ?? ''),
                    (string)($s['title'] ?? ''),
                    (string)($s['category'] ?? ''),
                    (string)($s['badge'] ?? ''),
                    $idx + 1,
                ]);
            }
        }

        if (isset($body['adminUsers']) && is_array($body['adminUsers'])) {
            $pdo->exec('DELETE FROM admin_users');
            $stmt = $pdo->prepare(
                'INSERT INTO admin_users (id, name, app_id, role, country, phone, whatsapp, avatar, cnic_number, cnic_front_image, cnic_back_image, city, appointment_code, documents_verified, status, level_title, joined_date, badge_title, notes, assigned_admin_id, assigned_admin_name, assigned_bd_ids)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['adminUsers'] as $a) {
                $stmt->execute([
                    (string)($a['id'] ?? ''),
                    (string)($a['name'] ?? ''),
                    (string)($a['appId'] ?? ''),
                    (string)($a['role'] ?? 'admin'),
                    (string)($a['country'] ?? ''),
                    (string)($a['phone'] ?? ''),
                    (string)($a['whatsapp'] ?? ''),
                    (string)($a['avatar'] ?? ''),
                    (string)($a['cnicNumber'] ?? ''),
                    (string)($a['cnicFrontImage'] ?? ''),
                    (string)($a['cnicBackImage'] ?? ''),
                    (string)($a['city'] ?? ''),
                    (string)($a['appointmentCode'] ?? ''),
                    !empty($a['documentsVerified']) ? 1 : 0,
                    (string)($a['status'] ?? 'active'),
                    (string)($a['level'] ?? ''),
                    (string)($a['joinedDate'] ?? ''),
                    (string)($a['badgeTitle'] ?? ''),
                    (string)($a['notes'] ?? ''),
                    (string)($a['assignedAdminId'] ?? ''),
                    (string)($a['assignedAdminName'] ?? ''),
                    json_encode($a['assignedBdIds'] ?? []),
                ]);
            }
        }

        if (isset($body['coinResellers']) && is_array($body['coinResellers'])) {
            $pdo->exec('DELETE FROM coin_resellers');
            $stmt = $pdo->prepare(
                'INSERT INTO coin_resellers (id, name, reseller_code, app_id, country, avatar, whatsapp_number, telegram, rating, coins_available, total_coins_sold, payment_methods, status, verified_since, discount_rate)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['coinResellers'] as $r) {
                $stmt->execute([
                    (string)($r['id'] ?? ''),
                    (string)($r['name'] ?? ''),
                    (string)($r['resellerCode'] ?? ''),
                    (string)($r['appId'] ?? ''),
                    (string)($r['country'] ?? ''),
                    (string)($r['avatar'] ?? ''),
                    (string)($r['whatsappNumber'] ?? ''),
                    (string)($r['telegram'] ?? ''),
                    (float)($r['rating'] ?? 5.0),
                    (int)($r['coinsAvailable'] ?? 0),
                    (int)($r['totalCoinsSold'] ?? 0),
                    json_encode($r['paymentMethods'] ?? []),
                    (string)($r['status'] ?? 'verified_official'),
                    (string)($r['verifiedSince'] ?? ''),
                    (string)($r['discountRate'] ?? ''),
                ]);
            }
        }

        if (isset($body['voiceRooms']) && is_array($body['voiceRooms'])) {
            $pdo->exec('DELETE FROM voice_rooms');
            $stmt = $pdo->prepare(
                'INSERT INTO voice_rooms (id, room_number, room_name, category, host_app_id, host_name, host_avatar, listeners_count, mic_seats, is_locked, is_featured, country, hot_score)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['voiceRooms'] as $rm) {
                $stmt->execute([
                    (string)($rm['id'] ?? ''),
                    (string)($rm['roomNumber'] ?? ''),
                    (string)($rm['roomName'] ?? ''),
                    (string)($rm['category'] ?? 'chat'),
                    (string)($rm['hostAppId'] ?? ''),
                    (string)($rm['hostName'] ?? ''),
                    (string)($rm['hostAvatar'] ?? ''),
                    (int)($rm['listenersCount'] ?? 0),
                    json_encode($rm['micSeats'] ?? []),
                    !empty($rm['isLocked']) ? 1 : 0,
                    !empty($rm['isFeatured']) ? 1 : 0,
                    (string)($rm['country'] ?? ''),
                    (int)($rm['hotScore'] ?? 0),
                ]);
            }
        }

        if (isset($body['agencies']) && is_array($body['agencies'])) {
            $pdo->exec('DELETE FROM agencies');
            $stmt = $pdo->prepare(
                'INSERT INTO agencies (id, agency_code, agency_name, owner_name, owner_app_id, contact_whatsapp, country, total_hosts, monthly_diamonds, target_hours, commission_percent, status, hosts_json)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['agencies'] as $ag) {
                $stmt->execute([
                    (string)($ag['id'] ?? ''),
                    (string)($ag['agencyCode'] ?? ''),
                    (string)($ag['agencyName'] ?? ''),
                    (string)($ag['ownerName'] ?? ''),
                    (string)($ag['ownerAppId'] ?? ''),
                    (string)($ag['contactWhatsapp'] ?? ''),
                    (string)($ag['country'] ?? ''),
                    (int)($ag['totalHosts'] ?? 0),
                    (int)($ag['monthlyDiamonds'] ?? 0),
                    (int)($ag['targetHours'] ?? 0),
                    (float)($ag['commissionPercent'] ?? 15),
                    (string)($ag['status'] ?? 'active'),
                    json_encode($ag['hosts'] ?? []),
                ]);
            }
        }

        if (isset($body['bdManagers']) && is_array($body['bdManagers'])) {
            $pdo->exec('DELETE FROM bd_managers');
            $stmt = $pdo->prepare(
                'INSERT INTO bd_managers (id, name, bd_code, app_id, region, phone, whatsapp, avatar, cnic_number, cnic_front_image, cnic_back_image, city, appointment_code, documents_verified, joined_date, assigned_admin_id, assigned_admin_name, total_agencies_recruited, target_monthly_diamonds, achieved_diamonds, commission_earned_usd, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['bdManagers'] as $b) {
                $stmt->execute([
                    (string)($b['id'] ?? ''),
                    (string)($b['name'] ?? ''),
                    (string)($b['bdCode'] ?? ''),
                    (string)($b['appId'] ?? ''),
                    (string)($b['region'] ?? ''),
                    (string)($b['phone'] ?? ''),
                    (string)($b['whatsapp'] ?? ''),
                    (string)($b['avatar'] ?? ''),
                    (string)($b['cnicNumber'] ?? ''),
                    (string)($b['cnicFrontImage'] ?? ''),
                    (string)($b['cnicBackImage'] ?? ''),
                    (string)($b['city'] ?? ''),
                    (string)($b['appointmentCode'] ?? ''),
                    !empty($b['documentsVerified']) ? 1 : 0,
                    (string)($b['joinedDate'] ?? ''),
                    (string)($b['assignedAdminId'] ?? ''),
                    (string)($b['assignedAdminName'] ?? ''),
                    (int)($b['totalAgenciesRecruited'] ?? 0),
                    (int)($b['targetMonthlyDiamonds'] ?? 0),
                    (int)($b['achievedDiamonds'] ?? 0),
                    (float)($b['commissionEarnedUSD'] ?? 0),
                    (string)($b['status'] ?? 'active'),
                ]);
            }
        }

        if (isset($body['tickets']) && is_array($body['tickets'])) {
            $pdo->exec('DELETE FROM support_tickets');
            $stmt = $pdo->prepare(
                'INSERT INTO support_tickets (id, ticket_number, user_app_id, user_name, user_avatar, subject, category, priority, status, assigned_cs_name, created_at, last_reply, description)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['tickets'] as $t) {
                $stmt->execute([
                    (string)($t['id'] ?? ''),
                    (string)($t['ticketNumber'] ?? ''),
                    (string)($t['userAppId'] ?? ''),
                    (string)($t['userName'] ?? ''),
                    (string)($t['userAvatar'] ?? ''),
                    (string)($t['subject'] ?? ''),
                    (string)($t['category'] ?? 'account_issue'),
                    (string)($t['priority'] ?? 'medium'),
                    (string)($t['status'] ?? 'open'),
                    (string)($t['assignedCsName'] ?? ''),
                    (string)($t['createdAt'] ?? ''),
                    (string)($t['lastReply'] ?? ''),
                    (string)($t['description'] ?? ''),
                ]);
            }
        }

        if (isset($body['transactions']) && is_array($body['transactions'])) {
            $pdo->exec('DELETE FROM coin_transactions');
            $stmt = $pdo->prepare(
                'INSERT INTO coin_transactions (id, receipt_number, reseller_id, reseller_name, buyer_app_id, buyer_name, coins_amount, bonus_amount, total_paid, currency, payment_method, timestamp_label, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['transactions'] as $tx) {
                $stmt->execute([
                    (string)($tx['id'] ?? ''),
                    (string)($tx['receiptNumber'] ?? ''),
                    (string)($tx['resellerId'] ?? ''),
                    (string)($tx['resellerName'] ?? ''),
                    (string)($tx['buyerAppId'] ?? ''),
                    (string)($tx['buyerName'] ?? ''),
                    (int)($tx['coinsAmount'] ?? 0),
                    (int)($tx['bonusAmount'] ?? 0),
                    (float)($tx['totalPaid'] ?? 0),
                    (string)($tx['currency'] ?? 'PKR'),
                    (string)($tx['paymentMethod'] ?? ''),
                    (string)($tx['timestamp'] ?? ''),
                    (string)($tx['status'] ?? 'completed'),
                ]);
            }
        }

        if (isset($body['freeCoinGrants']) && is_array($body['freeCoinGrants'])) {
            $pdo->exec('DELETE FROM free_coin_grants');
            $stmt = $pdo->prepare(
                'INSERT INTO free_coin_grants (id, grant_code, receiver_app_id, receiver_name, coins_amount, category, notes, granted_by, timestamp_label, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['freeCoinGrants'] as $g) {
                $stmt->execute([
                    (string)($g['id'] ?? ''),
                    (string)($g['grantCode'] ?? ''),
                    (string)($g['receiverAppId'] ?? ''),
                    (string)($g['receiverName'] ?? ''),
                    (int)($g['coinsAmount'] ?? 0),
                    (string)($g['category'] ?? 'owner_unlimited_mint'),
                    (string)($g['notes'] ?? ''),
                    (string)($g['grantedBy'] ?? 'Super Admin Owner'),
                    (string)($g['timestamp'] ?? ''),
                    (string)($g['status'] ?? 'minted'),
                ]);
            }
        }

        if (isset($body['bannedUsers']) && is_array($body['bannedUsers'])) {
            $pdo->exec('DELETE FROM banned_users');
            $stmt = $pdo->prepare(
                'INSERT INTO banned_users (id, app_id, user_name, avatar, ban_type, reason, banned_by, banned_at, expires_at, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['bannedUsers'] as $b) {
                $stmt->execute([
                    (string)($b['id'] ?? ''),
                    (string)($b['appId'] ?? ''),
                    (string)($b['userName'] ?? ''),
                    (string)($b['avatar'] ?? ''),
                    (string)($b['banType'] ?? 'permanent_ban'),
                    (string)($b['reason'] ?? ''),
                    (string)($b['bannedBy'] ?? 'Super Admin'),
                    (string)($b['bannedAt'] ?? ''),
                    $b['expiresAt'] ?? null,
                    (string)($b['status'] ?? 'banned'),
                ]);
            }
        }

        if (isset($body['staffApplications']) && is_array($body['staffApplications'])) {
            $pdo->exec('DELETE FROM staff_applications');
            $stmt = $pdo->prepare(
                'INSERT INTO staff_applications (id, name, app_id, role, assigned_admin_id, assigned_admin_name, phone, whatsapp, cnic_number, city, avatar, cnic_front_image, cnic_back_image, notes, submitted_at, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach ($body['staffApplications'] as $sa) {
                $stmt->execute([
                    (string)($sa['id'] ?? ''),
                    (string)($sa['name'] ?? ''),
                    (string)($sa['appId'] ?? ''),
                    (string)($sa['role'] ?? 'admin'),
                    (string)($sa['assignedAdminId'] ?? ''),
                    (string)($sa['assignedAdminName'] ?? ''),
                    (string)($sa['phone'] ?? ''),
                    (string)($sa['whatsapp'] ?? ''),
                    (string)($sa['cnicNumber'] ?? ''),
                    (string)($sa['city'] ?? ''),
                    (string)($sa['avatar'] ?? ''),
                    (string)($sa['cnicFrontImage'] ?? ''),
                    (string)($sa['cnicBackImage'] ?? ''),
                    (string)($sa['notes'] ?? ''),
                    (string)($sa['submittedAt'] ?? ''),
                    (string)($sa['status'] ?? 'pending'),
                ]);
            }
        }

        if (isset($body['broadcasts']) && is_array($body['broadcasts'])) {
            $pdo->exec('DELETE FROM broadcasts');
            $stmt = $pdo->prepare(
                'INSERT INTO broadcasts (id, message, sender, timestamp_label) VALUES (?, ?, ?, ?)'
            );
            foreach ($body['broadcasts'] as $bc) {
                $stmt->execute([
                    (string)($bc['id'] ?? ''),
                    (string)($bc['message'] ?? ''),
                    (string)($bc['sender'] ?? 'Super Admin'),
                    (string)($bc['timestamp'] ?? ''),
                ]);
            }
        }

        $pdo->commit();
        sendJson([
            'ok' => true,
            'syncedAt' => gmdate('Y-m-d H:i:s') . ' UTC'
        ]);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        sendJson([
            'ok' => false,
            'error' => 'Database sync transaction failed: ' . $e->getMessage()
        ], 500);
    }
}

sendJson(['ok' => false, 'error' => 'Method not allowed.'], 405);
