<?php
/**
 * =============================================================================
 * RB STAR Voice Chat Room - Authentication Endpoint (InfinityFree PHP + MySQL)
 * =============================================================================
 */

require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET' && $action === 'status') {
    $configured = isDbConfigured();
    $dbReady = false;
    $errorMsg = null;

    if ($configured) {
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->query("SHOW TABLES LIKE 'portal_auth'");
            $dbReady = (bool)$stmt->fetchColumn();
        } catch (Throwable $e) {
            $errorMsg = 'Database reachable check failed.';
        }
    }

    $token = getBearerToken();
    sendJson([
        'ok' => true,
        'backend' => 'infinityfree_php_mysql',
        'configured' => $configured,
        'dbReady' => $dbReady,
        'authenticated' => verifyAuthToken($token),
        'error' => $errorMsg
    ]);
}

if ($method === 'POST' && $action === 'login') {
    $pdo = getDbConnection();
    $body = getJsonBody();
    $password = trim((string)($body['password'] ?? ''));
    $ip = getClientIp();
    $now = time();

    // Check rate limiting (5 failed attempts -> 5 minute lockout)
    $stmt = $pdo->prepare('SELECT attempts, locked_until FROM login_attempts WHERE ip_address = ?');
    $stmt->execute([$ip]);
    $lockRow = $stmt->fetch();

    if ($lockRow && (int)$lockRow['locked_until'] > $now) {
        $remaining = (int)$lockRow['locked_until'] - $now;
        sendJson([
            'ok' => false,
            'locked' => true,
            'remainingSeconds' => $remaining,
            'error' => "Security lockdown active. Try again in {$remaining}s."
        ], 429);
    }

    if ($password === '') {
        sendJson(['ok' => false, 'error' => 'Password is required.'], 400);
    }

    $authStmt = $pdo->prepare('SELECT id, username, password_hash FROM portal_auth WHERE username = ? LIMIT 1');
    $authStmt->execute(['master_owner']);
    $user = $authStmt->fetch();

    if (!$user) {
        // Initialize row if missing
        $hash = password_hash('admin', PASSWORD_BCRYPT);
        $pdo->prepare('INSERT INTO portal_auth (username, password_hash) VALUES (?, ?)')->execute(['master_owner', $hash]);
        $user = ['id' => 1, 'username' => 'master_owner', 'password_hash' => $hash];
    }

    $valid = false;
    if ($user['password_hash'] === 'INIT_DEFAULT_ADMIN') {
        if ($password === 'admin') {
            $valid = true;
            $newHash = password_hash('admin', PASSWORD_BCRYPT);
            $pdo->prepare('UPDATE portal_auth SET password_hash = ? WHERE id = ?')->execute([$newHash, $user['id']]);
        }
    } else {
        $valid = password_verify($password, $user['password_hash']);
    }

    if ($valid) {
        $pdo->prepare('DELETE FROM login_attempts WHERE ip_address = ?')->execute([$ip]);
        $token = createAuthToken($user['username']);
        sendJson([
            'ok' => true,
            'token' => $token,
            'expiresIn' => TOKEN_TTL_SECONDS
        ]);
    }

    // Record failed attempt
    $attempts = ($lockRow ? (int)$lockRow['attempts'] : 0) + 1;
    $lockedUntil = $attempts >= 5 ? ($now + 300) : 0;
    $upsert = $pdo->prepare(
        'INSERT INTO login_attempts (ip_address, attempts, locked_until, last_attempt_at)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE attempts = VALUES(attempts), locked_until = VALUES(locked_until), last_attempt_at = VALUES(last_attempt_at)'
    );
    $upsert->execute([$ip, $attempts, $lockedUntil, $now]);

    sendJson([
        'ok' => false,
        'attempts' => $attempts,
        'locked' => $lockedUntil > 0,
        'remainingSeconds' => $lockedUntil > 0 ? 300 : 0,
        'error' => $lockedUntil > 0
            ? 'Security Alert: 5 failed attempts detected. Locked for 300s.'
            : 'Incorrect administrator password.'
    ], 401);
}

if ($method === 'POST' && $action === 'change_password') {
    requireAuth();
    $pdo = getDbConnection();
    $body = getJsonBody();
    $newPassword = trim((string)($body['newPassword'] ?? ''));

    if (strlen($newPassword) < 3) {
        sendJson(['ok' => false, 'error' => 'Password must be at least 3 characters.'], 400);
    }

    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
    $pdo->prepare('UPDATE portal_auth SET password_hash = ? WHERE username = ?')->execute([$hash, 'master_owner']);

    sendJson(['ok' => true, 'message' => 'Administrator password updated securely in MySQL.']);
}

if ($method === 'POST' && $action === 'logout') {
    sendJson(['ok' => true]);
}

sendJson(['ok' => false, 'error' => 'Invalid auth action.'], 400);
