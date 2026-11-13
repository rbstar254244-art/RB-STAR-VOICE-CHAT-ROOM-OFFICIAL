<?php
/**
 * =============================================================================
 * RB STAR Voice Chat Room - Mobile App Webhook Endpoint (InfinityFree PHP/MySQL)
 * =============================================================================
 * Allows Android / iOS / Agora / ZEGOCLOUD / Node servers to push real-time
 * events directly into your InfinityFree MySQL database using your API Key.
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['ok' => false, 'error' => 'POST method required.'], 405);
}

$pdo = getDbConnection();
$body = getJsonBody();

$cfgStmt = $pdo->prepare('SELECT setting_value FROM portal_settings WHERE setting_key = ? LIMIT 1');
$cfgStmt->execute(['app_config']);
$cfgJson = $cfgStmt->fetchColumn();
$appConfig = $cfgJson ? json_decode($cfgJson, true) : [];
$storedApiKey = $appConfig['apiKey'] ?? '';

$incomingKey = $_SERVER['HTTP_X_RBSTAR_API_KEY'] ?? ($body['apiKey'] ?? '');
if ($storedApiKey === '' || !hash_equals((string)$storedApiKey, (string)$incomingKey)) {
    sendJson(['ok' => false, 'error' => 'Invalid X-RBSTAR-API-KEY authorization.'], 401);
}

// Increment totalApiRequests counter
$appConfig['totalApiRequests'] = ((int)($appConfig['totalApiRequests'] ?? 0)) + 1;
$appConfig['lastSyncedAt'] = gmdate('Y-m-d H:i:s') . ' UTC';
$updCfg = $pdo->prepare('UPDATE portal_settings SET setting_value = ? WHERE setting_key = ?');
$updCfg->execute([json_encode($appConfig, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), 'app_config']);

$eventType = strtoupper(trim((string)($body['eventType'] ?? $body['action'] ?? 'PING')));
$payload = is_array($body['payload'] ?? null) ? $body['payload'] : $body;

if ($eventType === 'PING') {
    sendJson(['ok' => true, 'event' => 'PONG', 'syncedAt' => $appConfig['lastSyncedAt']]);
}

if ($eventType === 'BAN_USER' && !empty($payload['appId'])) {
    $id = 'ban-' . round(microtime(true) * 1000);
    $stmt = $pdo->prepare(
        'INSERT INTO banned_users (id, app_id, user_name, ban_type, reason, banned_by, banned_at, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $id,
        (string)$payload['appId'],
        (string)($payload['userName'] ?? ('User_' . $payload['appId'])),
        (string)($payload['banType'] ?? 'permanent_ban'),
        (string)($payload['reason'] ?? 'Mobile App Webhook Enforcement'),
        'Mobile App Server',
        gmdate('Y-m-d H:i'),
        'banned'
    ]);
    sendJson(['ok' => true, 'action' => 'banned', 'banId' => $id]);
}

if ($eventType === 'UNBAN_USER' && !empty($payload['appId'])) {
    $stmt = $pdo->prepare('UPDATE banned_users SET status = ? WHERE app_id = ?');
    $stmt->execute(['unbanned', (string)$payload['appId']]);
    sendJson(['ok' => true, 'action' => 'unbanned', 'appId' => (string)$payload['appId']]);
}

if ($eventType === 'VERIFY_ID' && !empty($payload['appId'])) {
    $appId = (string)$payload['appId'];
    $banStmt = $pdo->prepare('SELECT status, ban_type, reason FROM banned_users WHERE app_id = ? AND status = ? LIMIT 1');
    $banStmt->execute([$appId, 'banned']);
    $ban = $banStmt->fetch();

    $admStmt = $pdo->prepare('SELECT id, name, role, status, badge_title FROM admin_users WHERE app_id = ? LIMIT 1');
    $admStmt->execute([$appId]);
    $admin = $admStmt->fetch();

    sendJson([
        'ok' => true,
        'appId' => $appId,
        'isBanned' => (bool)$ban,
        'banDetails' => $ban ?: null,
        'isOfficialStaff' => (bool)$admin,
        'staffDetails' => $admin ?: null
    ]);
}

sendJson(['ok' => true, 'receivedEvent' => $eventType]);
