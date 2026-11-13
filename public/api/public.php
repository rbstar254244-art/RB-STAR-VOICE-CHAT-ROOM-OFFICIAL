<?php
/**
 * =============================================================================
 * RB STAR Voice Chat Room - Public Read-Only & Staff Application Endpoint
 * =============================================================================
 */

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';
$pdo = getDbConnection();

// Public Staff Application Submission
if ($method === 'POST' && $action === 'submit_application') {
    $body = getJsonBody();
    $name = trim((string)($body['name'] ?? ''));
    $appId = trim((string)($body['appId'] ?? ''));
    $role = trim((string)($body['role'] ?? 'admin'));
    $phone = trim((string)($body['phone'] ?? ''));
    $cnic = trim((string)($body['cnicNumber'] ?? ''));

    if ($name === '' || $appId === '' || $phone === '' || $cnic === '') {
        sendJson(['ok' => false, 'error' => 'Missing required application fields.'], 400);
    }

    $allowedRoles = ['admin', 'bd', 'super_admin'];
    if (!in_array($role, $allowedRoles, true)) {
        $role = 'admin';
    }

    $id = 'app-' . round(microtime(true) * 1000);
    $submittedAt = gmdate('Y-m-d H:i');

    $stmt = $pdo->prepare(
        'INSERT INTO staff_applications
        (id, name, app_id, role, assigned_admin_id, assigned_admin_name, phone, whatsapp, cnic_number, city, avatar, cnic_front_image, cnic_back_image, notes, submitted_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id,
        $name,
        $appId,
        $role,
        (string)($body['assignedAdminId'] ?? ''),
        (string)($body['assignedAdminName'] ?? ''),
        $phone,
        (string)($body['whatsapp'] ?? $phone),
        $cnic,
        (string)($body['city'] ?? ''),
        (string)($body['avatar'] ?? ''),
        (string)($body['cnicFrontImage'] ?? ''),
        (string)($body['cnicBackImage'] ?? ''),
        (string)($body['notes'] ?? ''),
        $submittedAt,
        'pending'
    ]);

    sendJson([
        'ok' => true,
        'application' => [
            'id' => $id,
            'submittedAt' => $submittedAt,
            'status' => 'pending'
        ]
    ], 201);
}

// Public Staff ID Lookup (Safe fields only - no private CNIC documents leaked publicly)
if ($method === 'GET' && isset($_GET['verify_id'])) {
    $q = strtolower(trim((string)$_GET['verify_id']));
    if ($q === '') {
        sendJson(['ok' => true, 'found' => false]);
    }

    // 1. Check Admins
    $stmt = $pdo->prepare('SELECT id, name, app_id, role, country, avatar, city, appointment_code, status, level_title, joined_date, badge_title FROM admin_users WHERE LOWER(app_id) = ? OR LOWER(id) = ? LIMIT 1');
    $stmt->execute([$q, $q]);
    if ($row = $stmt->fetch()) {
        sendJson([
            'ok' => true,
            'found' => true,
            'type' => $row['role'],
            'data' => [
                'id' => $row['id'],
                'name' => $row['name'],
                'appId' => $row['app_id'],
                'role' => $row['role'],
                'country' => $row['country'],
                'avatar' => $row['avatar'],
                'city' => $row['city'],
                'appointmentCode' => $row['appointment_code'],
                'status' => $row['status'],
                'level' => $row['level_title'],
                'joinedDate' => $row['joined_date'],
                'badgeTitle' => $row['badge_title']
            ]
        ]);
    }

    // 2. Check Coin Resellers
    $stmt = $pdo->prepare('SELECT id, name, reseller_code, app_id, country, avatar, rating, status, verified_since, discount_rate FROM coin_resellers WHERE LOWER(app_id) = ? OR LOWER(reseller_code) = ? LIMIT 1');
    $stmt->execute([$q, $q]);
    if ($row = $stmt->fetch()) {
        sendJson([
            'ok' => true,
            'found' => true,
            'type' => 'coin_reseller',
            'data' => [
                'id' => $row['id'],
                'name' => $row['name'],
                'resellerCode' => $row['reseller_code'],
                'appId' => $row['app_id'],
                'country' => $row['country'],
                'avatar' => $row['avatar'],
                'rating' => (float)$row['rating'],
                'status' => $row['status'],
                'verifiedSince' => $row['verified_since'],
                'discountRate' => $row['discount_rate']
            ]
        ]);
    }

    // 3. Check BD Managers
    $stmt = $pdo->prepare('SELECT id, name, bd_code, app_id, region, avatar, appointment_code, status FROM bd_managers WHERE LOWER(app_id) = ? OR LOWER(bd_code) = ? LIMIT 1');
    $stmt->execute([$q, $q]);
    if ($row = $stmt->fetch()) {
        sendJson([
            'ok' => true,
            'found' => true,
            'type' => 'bd',
            'data' => [
                'id' => $row['id'],
                'name' => $row['name'],
                'bdCode' => $row['bd_code'],
                'appId' => $row['app_id'],
                'region' => $row['region'],
                'avatar' => $row['avatar'],
                'appointmentCode' => $row['appointment_code'],
                'status' => $row['status']
            ]
        ]);
    }

    sendJson([
        'ok' => true,
        'found' => false,
        'warning' => 'ATTENTION: This ID is NOT found in the Official RB STAR Registry!'
    ]);
}

// Default GET: Return sanitized public landing page config, screenshots & coin packages
if ($method === 'GET') {
    $cfgStmt = $pdo->prepare('SELECT setting_value FROM portal_settings WHERE setting_key = ? LIMIT 1');
    $cfgStmt->execute(['app_config']);
    $cfgJson = $cfgStmt->fetchColumn();
    $appConfig = $cfgJson ? json_decode($cfgJson, true) : [];

    if (is_array($appConfig)) {
        // Strip private API secrets from unauthenticated public response
        unset($appConfig['apiKey']);
    }

    $pkgStmt = $pdo->query('SELECT id, coins, bonus_coins, price_pkr, price_usd, price_inr, badge FROM coin_packages ORDER BY sort_order ASC');
    $packages = array_map(static function ($r) {
        return [
            'id' => $r['id'],
            'coins' => (int)$r['coins'],
            'bonusCoins' => (int)$r['bonus_coins'],
            'pricePKR' => (float)$r['price_pkr'],
            'priceUSD' => (float)$r['price_usd'],
            'priceINR' => (float)$r['price_inr'],
            'badge' => $r['badge'] ?: null,
        ];
    }, $pkgStmt->fetchAll());

    $shotStmt = $pdo->query('SELECT id, src, title, category, badge FROM app_screenshots ORDER BY sort_order ASC');
    $screenshots = $shotStmt->fetchAll();

    sendJson([
        'ok' => true,
        'appConfig' => $appConfig,
        'coinPackages' => $packages,
        'screenshots' => $screenshots
    ]);
}

sendJson(['ok' => false, 'error' => 'Method not allowed.'], 405);
