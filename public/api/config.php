<?php
/**
 * =============================================================================
 * RB STAR Voice Chat Room - InfinityFree MySQL & Security Configuration
 * =============================================================================
 * BEFORE UPLOADING TO INFINITYFREE:
 * Replace the 4 database values below with your InfinityFree Control Panel
 * (vPanel -> MySQL Databases) credentials:
 *   - DB_HOST: e.g. 'sql305.infinityfree.com'
 *   - DB_NAME: e.g. 'if0_38492011_rbstar'
 *   - DB_USER: e.g. 'if0_38492011'
 *   - DB_PASS: Your vPanel / MySQL password
 * =============================================================================
 */

define('DB_HOST', 'sqlXXX.infinityfree.com');
define('DB_NAME', 'if0_XXXXXXXX_rbstar');
define('DB_USER', 'if0_XXXXXXXX');
define('DB_PASS', 'YOUR_INFINITYFREE_MYSQL_PASSWORD');

// Change this secret phrase to any random string for signing admin tokens
define('APP_AUTH_SECRET', 'RBSTAR_CHANGE_THIS_SECRET_KEY_2026_SECURE');
define('TOKEN_TTL_SECONDS', 86400); // 24 hours

// Security & JSON response headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

// Allow same-origin requests cleanly
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $host = $_SERVER['HTTP_HOST'] ?? '';
    $originHost = parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
    if ($originHost && $host && strcasecmp($originHost, explode(':', $host)[0]) === 0) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
        header('Access-Control-Allow-Credentials: true');
    }
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-RBSTAR-API-KEY');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function sendJson($data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function isDbConfigured(): bool {
    return DB_HOST !== 'sqlXXX.infinityfree.com'
        && DB_NAME !== 'if0_XXXXXXXX_rbstar'
        && DB_USER !== 'if0_XXXXXXXX'
        && DB_PASS !== 'YOUR_INFINITYFREE_MYSQL_PASSWORD';
}

function getDbConnection(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    if (!isDbConfigured()) {
        sendJson([
            'ok' => false,
            'configured' => false,
            'error' => 'InfinityFree MySQL credentials are not configured yet in api/config.php.'
        ], 503);
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        return $pdo;
    } catch (PDOException $e) {
        sendJson([
            'ok' => false,
            'configured' => true,
            'error' => 'MySQL connection failed. Check DB_HOST, DB_NAME, DB_USER, DB_PASS in api/config.php.'
        ], 500);
    }
}

function getClientIp(): string {
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return substr($_SERVER['HTTP_CF_CONNECTING_IP'], 0, 64);
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return substr(trim($parts[0]), 0, 64);
    }
    return substr($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', 0, 64);
}

function base64UrlEncode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64UrlDecode(string $data): string {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}

function createAuthToken(string $username = 'master_owner'): string {
    $payload = [
        'sub' => $username,
        'iat' => time(),
        'exp' => time() + TOKEN_TTL_SECONDS,
    ];
    $encoded = base64UrlEncode(json_encode($payload));
    $sig = base64UrlEncode(hash_hmac('sha256', $encoded, APP_AUTH_SECRET, true));
    return $encoded . '.' . $sig;
}

function getBearerToken(): ?string {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$header && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        foreach ($headers as $k => $v) {
            if (strtolower($k) === 'authorization') {
                $header = $v;
                break;
            }
        }
    }
    if (preg_match('/Bearer\s+(.+)$/i', $header, $matches)) {
        return trim($matches[1]);
    }
    return null;
}

function verifyAuthToken(?string $token): bool {
    if (!$token || strpos($token, '.') === false) return false;
    [$encoded, $sig] = explode('.', $token, 2);
    $expected = base64UrlEncode(hash_hmac('sha256', $encoded, APP_AUTH_SECRET, true));
    if (!hash_equals($expected, $sig)) return false;

    $payload = json_decode(base64UrlDecode($encoded), true);
    if (!is_array($payload) || empty($payload['exp']) || time() > (int)$payload['exp']) {
        return false;
    }
    return true;
}

function requireAuth(): void {
    $token = getBearerToken();
    if (!verifyAuthToken($token)) {
        sendJson([
            'ok' => false,
            'error' => 'Unauthorized. Please log in with administrator password.'
        ], 401);
    }
}
