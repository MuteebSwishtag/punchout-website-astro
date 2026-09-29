<?php
declare(strict_types=1);

date_default_timezone_set('America/New_York');

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function starts_with(string $value, string $prefix): bool
{
    return substr($value, 0, strlen($prefix)) === $prefix;
}

function ends_with(string $value, string $suffix): bool
{
    return $suffix === '' || substr($value, -strlen($suffix)) === $suffix;
}

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function load_php_config_file(string $path): array
{
    if (!is_readable($path)) {
        return [];
    }

    $config = require $path;
    return is_array($config) ? $config : [];
}

function load_env_file(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || starts_with($line, '#') || strpos($line, '=') === false) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        $existing = getenv($key);

        if ($key === '' || ($existing !== false && $existing !== '')) {
            continue;
        }

        if ((starts_with($value, '"') && ends_with($value, '"')) || (starts_with($value, "'") && ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

$envPaths = [
    __DIR__ . '/.env',
    dirname(__DIR__) . '/.env',
    dirname(__DIR__, 2) . '/.env',
    dirname(__DIR__, 3) . '/.env',
];
if (!empty($_SERVER['DOCUMENT_ROOT'])) {
    $documentRoot = rtrim((string) $_SERVER['DOCUMENT_ROOT'], '/\\');
    $envPaths[] = $documentRoot . '/.env';
    $envPaths[] = dirname($documentRoot) . '/.env';
    $envPaths[] = dirname($documentRoot) . '/punchout-book-demo.env';
}

foreach (array_unique($envPaths) as $envPath) {
    load_env_file($envPath);
}

$explicitEnvPath = getenv('BOOK_DEMO_ENV_PATH');
if ($explicitEnvPath !== false && trim((string) $explicitEnvPath) !== '') {
    load_env_file(trim((string) $explicitEnvPath));
}

$privateConfigPaths = [];
$explicitConfigPath = getenv('BOOK_DEMO_CONFIG_PATH');
if ($explicitConfigPath !== false && trim((string) $explicitConfigPath) !== '') {
    $privateConfigPaths[] = trim((string) $explicitConfigPath);
}
$privateConfigPaths[] = dirname(__DIR__, 2) . '/punchout-book-demo-config.php';
$privateConfigPaths[] = dirname(__DIR__, 2) . '/punchout-mail-config.php';
if (!empty($_SERVER['DOCUMENT_ROOT'])) {
    $documentRoot = rtrim((string) $_SERVER['DOCUMENT_ROOT'], '/\\');
    $privateConfigPaths[] = dirname($documentRoot) . '/punchout-book-demo-config.php';
    $privateConfigPaths[] = dirname($documentRoot) . '/punchout-mail-config.php';
}

$privateConfig = [];
foreach (array_unique($privateConfigPaths) as $configPath) {
    $privateConfig = load_php_config_file($configPath);
    if ($privateConfig !== []) {
        break;
    }
}

function private_config_value(string $envKey)
{
    global $privateConfig;

    $keyMap = [
        'BOOK_DEMO_ADMIN_USERNAME' => 'admin_username',
        'BOOK_DEMO_ADMIN_PASSWORD' => 'admin_password',
        'BOOK_DEMO_DB_ENABLED' => 'db_enabled',
        'BOOK_DEMO_DB_TABLE' => 'db_table',
        'BOOK_DEMO_TIMEZONE' => 'timezone',
        'DB_HOST' => 'db_host',
        'DB_PORT' => 'db_port',
        'DB_SOCKET' => 'db_socket',
        'DB_DATABASE' => 'db_database',
        'DB_USERNAME' => 'db_username',
        'DB_PASSWORD' => 'db_password',
        'DB_CHARSET' => 'db_charset',
    ];

    $candidateKeys = array_filter([
        $envKey,
        $keyMap[$envKey] ?? '',
        strtolower($envKey),
    ]);

    foreach ($candidateKeys as $key) {
        if (array_key_exists($key, $privateConfig) && is_scalar($privateConfig[$key])) {
            return trim((string) $privateConfig[$key]);
        }
    }

    return null;
}

function env_value(string $key, string $fallback = ''): string
{
    $privateValue = private_config_value($key);
    if ($privateValue !== null) {
        return $privateValue;
    }

    $value = getenv($key);
    if ($value === false && isset($_SERVER[$key])) {
        $value = $_SERVER[$key];
    }
    return trim((string) ($value === false ? $fallback : $value));
}

function env_flag(string $key, bool $fallback = false): bool
{
    $value = strtolower(env_value($key));
    if ($value === '') {
        return $fallback;
    }
    return in_array($value, ['1', 'true', 'yes', 'on'], true);
}

function configured_timezone(): string
{
    $timezone = env_value('BOOK_DEMO_TIMEZONE', 'America/New_York');
    try {
        new DateTimeZone($timezone);
        return $timezone;
    } catch (Throwable $error) {
        return 'America/New_York';
    }
}

date_default_timezone_set(configured_timezone());

function clean_string($value, int $max = 1000): string
{
    $value = is_scalar($value) ? (string) $value : '';
    $value = trim(strip_tags($value));
    $value = preg_replace('/[ \t]+/', ' ', $value) ?? $value;
    return substr($value, 0, $max);
}

function request_basic_auth(): array
{
    $user = $_SERVER['PHP_AUTH_USER'] ?? '';
    $pass = $_SERVER['PHP_AUTH_PW'] ?? '';

    if (($user === '' || $pass === '') && !empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $auth = (string) $_SERVER['HTTP_AUTHORIZATION'];
        if (stripos($auth, 'basic ') === 0) {
            $decoded = base64_decode(substr($auth, 6), true);
            if (is_string($decoded) && strpos($decoded, ':') !== false) {
                [$user, $pass] = explode(':', $decoded, 2);
            }
        }
    }

    return [(string) $user, (string) $pass];
}

function require_admin_auth(): void
{
    $expectedUser = env_value('BOOK_DEMO_ADMIN_USERNAME');
    $expectedPass = env_value('BOOK_DEMO_ADMIN_PASSWORD');

    if ($expectedUser === '' || $expectedPass === '') {
        respond(503, ['ok' => false, 'message' => 'Admin credentials are not configured.']);
    }

    [$user, $pass] = request_basic_auth();
    if (!hash_equals($expectedUser, $user) || !hash_equals($expectedPass, $pass)) {
        respond(401, ['ok' => false, 'message' => 'Invalid admin username or password.']);
    }
}

function db_table_name(): string
{
    $table = env_value('BOOK_DEMO_DB_TABLE', 'book_demo_submissions');
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $table) ?? '';
    return $table !== '' ? $table : 'book_demo_submissions';
}

function db_quote_identifier(string $identifier): string
{
    return '`' . str_replace('`', '``', $identifier) . '`';
}

function db_connection(): PDO
{
    if (!env_flag('BOOK_DEMO_DB_ENABLED')) {
        throw new RuntimeException('MySQL storage is not enabled.');
    }

    if (!class_exists(PDO::class)) {
        throw new RuntimeException('PHP PDO is not available.');
    }

    $database = env_value('DB_DATABASE');
    $username = env_value('DB_USERNAME');
    $password = env_value('DB_PASSWORD');
    $charset = env_value('DB_CHARSET', 'utf8mb4');
    $socket = env_value('DB_SOCKET');
    $host = env_value('DB_HOST', '127.0.0.1');
    $port = env_value('DB_PORT', '3306');

    if ($database === '' || $username === '') {
        throw new RuntimeException('DB_DATABASE or DB_USERNAME is missing.');
    }

    $dsn = $socket !== ''
        ? 'mysql:unix_socket=' . $socket . ';dbname=' . $database . ';charset=' . $charset
        : 'mysql:host=' . $host . ';port=' . $port . ';dbname=' . $database . ';charset=' . $charset;

    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $offset = (new DateTimeImmutable('now', new DateTimeZone(configured_timezone())))->format('P');
    if (preg_match('/^[+-]\d{2}:\d{2}$/', $offset)) {
        $pdo->exec('SET time_zone = ' . $pdo->quote($offset));
    }
    return $pdo;
}

function ensure_submission_table(PDO $pdo): void
{
    $table = db_quote_identifier(db_table_name());
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS {$table} (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            form_source VARCHAR(80) NOT NULL DEFAULT 'book-demo',
            pricing_plan VARCHAR(80) NOT NULL DEFAULT '',
            name VARCHAR(160) NOT NULL,
            email VARCHAR(254) NOT NULL,
            contact VARCHAR(80) NOT NULL DEFAULT '',
            company VARCHAR(160) NOT NULL,
            website VARCHAR(250) NOT NULL DEFAULT '',
            buyer_procurement_system VARCHAR(120) NOT NULL,
            commerce_platform VARCHAR(120) NOT NULL DEFAULT '',
            technology VARCHAR(160) NOT NULL DEFAULT '',
            buyer_request TEXT NULL,
            selected_date VARCHAR(120) NOT NULL DEFAULT '',
            selected_date_iso DATE NULL,
            selected_time VARCHAR(10) NOT NULL DEFAULT '',
            selected_time_label VARCHAR(80) NOT NULL DEFAULT '',
            timezone VARCHAR(80) NOT NULL DEFAULT '',
            meeting_start_utc DATETIME NULL,
            page VARCHAR(500) NOT NULL DEFAULT '',
            referrer VARCHAR(500) NOT NULL DEFAULT '',
            ip_address VARCHAR(45) NOT NULL DEFAULT '',
            user_agent TEXT NULL,
            status VARCHAR(40) NOT NULL DEFAULT 'received',
            email_enabled TINYINT(1) NOT NULL DEFAULT 0,
            email_sent TINYINT(1) NOT NULL DEFAULT 0,
            zoom_enabled TINYINT(1) NOT NULL DEFAULT 0,
            zoom_meeting_id VARCHAR(80) NOT NULL DEFAULT '',
            zoom_join_url VARCHAR(1000) NOT NULL DEFAULT '',
            zoom_start_url VARCHAR(1000) NOT NULL DEFAULT '',
            raw_payload LONGTEXT NULL,
            error_message TEXT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_book_demo_created_at (created_at),
            KEY idx_book_demo_email (email),
            KEY idx_book_demo_form_source (form_source),
            KEY idx_book_demo_commerce_platform (commerce_platform),
            KEY idx_book_demo_pricing_plan (pricing_plan)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}

function fetch_submissions(PDO $pdo, string $source, int $limit): array
{
    $table = db_quote_identifier(db_table_name());
    $statement = $pdo->prepare("
        SELECT
            id,
            form_source,
            pricing_plan,
            name,
            email,
            contact,
            company,
            website,
            buyer_procurement_system,
            commerce_platform,
            technology,
            buyer_request,
            selected_date,
            selected_time_label,
            timezone,
            meeting_start_utc,
            page,
            referrer,
            ip_address,
            status,
            email_enabled,
            email_sent,
            zoom_enabled,
            zoom_meeting_id,
            zoom_join_url,
            error_message,
            created_at,
            updated_at
        FROM {$table}
        WHERE form_source = :source
        ORDER BY created_at DESC, id DESC
        LIMIT {$limit}
    ");
    $statement->execute([':source' => $source]);
    return $statement->fetchAll();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(405, ['ok' => false, 'message' => 'This endpoint only accepts GET requests.']);
}

try {
    require_admin_auth();

    $limit = (int) ($_GET['limit'] ?? 100);
    $limit = max(1, min(250, $limit));

    $pdo = db_connection();
    ensure_submission_table($pdo);

    $bookDemo = fetch_submissions($pdo, 'book-demo', $limit);
    $pricing = fetch_submissions($pdo, 'pricing-interest', $limit);

    respond(200, [
        'ok' => true,
        'book_demo' => $bookDemo,
        'pricing' => $pricing,
        'timezone' => configured_timezone(),
        'counts' => [
            'book_demo' => count($bookDemo),
            'pricing' => count($pricing),
        ],
    ]);
} catch (Throwable $error) {
    error_log('PunchOut admin submissions failed: ' . $error->getMessage());
    respond(500, [
        'ok' => false,
        'message' => 'Could not load submissions. Check admin, database, and PHP configuration.',
    ]);
}
