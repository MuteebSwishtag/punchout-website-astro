<?php
declare(strict_types=1);

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
];
if (!empty($_SERVER['DOCUMENT_ROOT'])) {
    $documentRoot = rtrim((string) $_SERVER['DOCUMENT_ROOT'], '/\\');
    $envPaths[] = $documentRoot . '/.env';
    $envPaths[] = dirname($documentRoot) . '/.env';
}

foreach (array_unique($envPaths) as $envPath) {
    load_env_file($envPath);
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
        'BOOK_DEMO_ENDPOINT_TOKEN' => 'endpoint_token',
        'BOOK_DEMO_EMAIL_ENABLED' => 'email_enabled',
        'BOOK_DEMO_TO' => 'to',
        'MAIL_MAILER' => 'mailer',
        'MAIL_HOST' => 'host',
        'MAIL_PORT' => 'port',
        'MAIL_ENCRYPTION' => 'encryption',
        'MAIL_USERNAME' => 'username',
        'MAIL_PASSWORD' => 'password',
        'MAIL_FROM_ADDRESS' => 'from_address',
        'MAIL_FROM_NAME' => 'from_name',
        'BOOK_DEMO_ZOOM_ENABLED' => 'zoom_enabled',
        'ZOOM_ACCOUNT_ID' => 'zoom_account_id',
        'ZOOM_CLIENT_ID' => 'zoom_client_id',
        'ZOOM_CLIENT_SECRET' => 'zoom_client_secret',
        'ZOOM_USER_ID' => 'zoom_user_id',
        'ZOOM_MEETING_DURATION_MINUTES' => 'zoom_meeting_duration_minutes',
        'ZOOM_REGISTRATION_ENABLED' => 'zoom_registration_enabled',
        'ZOOM_INVITEE_EMAILS' => 'zoom_invitee_emails',
        'ZOOM_CONTACT_NAME' => 'zoom_contact_name',
        'ZOOM_CONTACT_EMAIL' => 'zoom_contact_email',
        'ZOOM_MEETING_TOPIC_TEMPLATE' => 'zoom_meeting_topic_template',
        'ZOOM_MEETING_AGENDA_TEMPLATE' => 'zoom_meeting_agenda_template',
    ];

    $candidateKeys = array_filter([
        $envKey,
        $keyMap[$envKey] ?? '',
        strtolower($envKey),
    ]);

    foreach ($candidateKeys as $key) {
        if (array_key_exists($key, $privateConfig) && is_scalar($privateConfig[$key])) {
            if (is_bool($privateConfig[$key])) {
                return $privateConfig[$key] ? 'true' : 'false';
            }
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

function clean_string($value, int $max = 1000): string
{
    $value = is_scalar($value) ? (string) $value : '';
    $value = trim(strip_tags($value));
    $value = preg_replace('/[ \t]+/', ' ', $value) ?? $value;
    return substr($value, 0, $max);
}

function split_emails(string $value): array
{
    $emails = array_filter(array_map('trim', explode(',', $value)));
    return array_values(array_filter($emails, static fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL)));
}

function read_payload(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input') ?: '';
        $payload = json_decode($raw, true);
        return is_array($payload) ? $payload : [];
    }
    return $_POST;
}

function normalize_website(string $value): string
{
    if ($value === '') {
        return '';
    }
    if (preg_match('/\s/', $value)) {
        return '';
    }
    $candidate = preg_match('/^[a-z][a-z0-9+.-]*:\/\//i', $value) ? $value : 'https://' . $value;
    $parts = parse_url($candidate);
    if (!$parts || !in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true) || empty($parts['host']) || strpos($parts['host'], '.') === false) {
        return '';
    }
    return $candidate;
}

function get_meeting_start(array $data): ?DateTimeImmutable
{
    $date = clean_string($data['selectedDateISO'] ?? '', 20);
    $time = clean_string($data['selectedTime'] ?? '', 10);
    $timezone = clean_string($data['timezone'] ?? 'UTC', 80);

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2}$/', $time)) {
        return null;
    }

    try {
        return new DateTimeImmutable($date . ' ' . $time . ':00', new DateTimeZone($timezone));
    } catch (Throwable $error) {
        return null;
    }
}

function json_request(string $url, string $method, array $headers = [], ?array $payload = null): array
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('PHP cURL is required for Zoom integration.');
    }

    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 25,
    ]);

    if ($payload !== null) {
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_SLASHES));
    }

    $body = curl_exec($curl);
    $error = curl_error($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($body === false) {
        throw new RuntimeException($error ?: 'HTTP request failed.');
    }

    $decoded = $body !== '' ? json_decode($body, true) : [];
    $decoded = is_array($decoded) ? $decoded : ['message' => substr($body, 0, 500)];

    if ($status < 200 || $status >= 300) {
        $message = $decoded['message'] ?? $decoded['reason'] ?? 'Request failed.';
        throw new RuntimeException('Zoom API ' . $status . ': ' . $message);
    }

    return $decoded;
}

function render_template(string $template, array $context): string
{
    return preg_replace_callback('/\$\{([a-zA-Z0-9_.-]+)\}/', static function ($match) use ($context) {
        $value = $context;
        foreach (explode('.', $match[1]) as $part) {
            $value = is_array($value) && array_key_exists($part, $value) ? $value[$part] : '';
        }
        return clean_string($value, 200);
    }, $template) ?? $template;
}

function create_zoom_meeting(array $data, DateTimeImmutable $meetingStart): array
{
    if (!env_flag('BOOK_DEMO_ZOOM_ENABLED')) {
        return ['enabled' => false];
    }

    $accountId = env_value('ZOOM_ACCOUNT_ID');
    $clientId = env_value('ZOOM_CLIENT_ID');
    $clientSecret = env_value('ZOOM_CLIENT_SECRET');
    if ($accountId === '' || $clientId === '' || $clientSecret === '') {
        throw new RuntimeException('Zoom is enabled but ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, or ZOOM_CLIENT_SECRET is missing.');
    }

    $tokenUrl = 'https://zoom.us/oauth/token?grant_type=account_credentials&account_id=' . rawurlencode($accountId);
    $token = json_request($tokenUrl, 'POST', [
        'Authorization: Basic ' . base64_encode($clientId . ':' . $clientSecret),
        'Content-Type: application/x-www-form-urlencoded',
    ]);

    $accessToken = clean_string($token['access_token'] ?? '', 2000);
    if ($accessToken === '') {
        throw new RuntimeException('Zoom did not return an access token.');
    }

    $customerEmail = clean_string($data['email'] ?? '', 254);
    $invitees = array_unique(array_map('strtolower', array_merge(
        split_emails(env_value('ZOOM_INVITEE_EMAILS', env_value('MAIL_TO'))),
        $customerEmail !== '' ? [$customerEmail] : []
    )));
    $timezone = clean_string($data['timezone'] ?? 'UTC', 80);
    $context = [
        'name' => clean_string($data['name'] ?? '', 160),
        'company' => clean_string($data['company'] ?? '', 160),
        'platform' => clean_string($data['platform'] ?? '', 120),
        'message' => clean_string($data['message'] ?? '', 500),
    ];

    $payload = [
        'topic' => substr(render_template(env_value('ZOOM_MEETING_TOPIC_TEMPLATE', 'PunchOut Central demo with ${company}'), $context), 0, 200),
        'type' => 2,
        'start_time' => $meetingStart->format('Y-m-d\TH:i:s'),
        'duration' => max(15, (int) env_value('ZOOM_MEETING_DURATION_MINUTES', '30')),
        'timezone' => $timezone,
        'agenda' => substr(render_template(env_value('ZOOM_MEETING_AGENDA_TEMPLATE', 'Demo requested by ${name} from ${company}. Buyer platform: ${platform}.'), $context), 0, 2000),
        'settings' => [
            'host_video' => true,
            'participant_video' => true,
            'join_before_host' => false,
            'mute_upon_entry' => true,
            'waiting_room' => true,
            'approval_type' => env_flag('ZOOM_REGISTRATION_ENABLED', true) ? 0 : 2,
            'email_notification' => true,
            'registrants_confirmation_email' => true,
            'registrants_email_notification' => true,
            'calendar_type' => 1,
            'contact_name' => env_value('ZOOM_CONTACT_NAME', env_value('MAIL_FROM_NAME', 'PunchOut Central')),
            'contact_email' => env_value('ZOOM_CONTACT_EMAIL', env_value('MAIL_FROM_ADDRESS')),
            'meeting_invitees' => array_map(static fn($email) => ['email' => $email], $invitees),
        ],
    ];

    $configuredUserId = env_value('ZOOM_USER_ID', 'me');
    if ($configuredUserId === '' || strtolower($configuredUserId) === 'me') {
        $user = json_request('https://api.zoom.us/v2/users/me', 'GET', [
            'Authorization: Bearer ' . $accessToken,
        ]);
        $configuredUserId = clean_string(($user['id'] ?? '') ?: ($user['email'] ?? ''), 200);
    }
    if ($configuredUserId === '') {
        throw new RuntimeException('Zoom did not return a host user id.');
    }

    $userId = rawurlencode($configuredUserId);
    $meeting = json_request('https://api.zoom.us/v2/users/' . $userId . '/meetings', 'POST', [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json',
    ], $payload);

    $registrant = null;
    if (env_flag('ZOOM_REGISTRATION_ENABLED', true) && $customerEmail !== '' && !empty($meeting['id'])) {
        $nameParts = preg_split('/\s+/', clean_string($data['name'] ?? 'Guest Customer', 160), -1, PREG_SPLIT_NO_EMPTY) ?: ['Guest'];
        $registrant = json_request('https://api.zoom.us/v2/meetings/' . rawurlencode((string) $meeting['id']) . '/registrants', 'POST', [
            'Authorization: Bearer ' . $accessToken,
            'Content-Type: application/json',
        ], [
            'email' => $customerEmail,
            'first_name' => $nameParts[0],
            'last_name' => count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : 'Customer',
            'org' => clean_string($data['company'] ?? '', 128),
            'comments' => clean_string($data['message'] ?? '', 500),
        ]);
    }

    return [
        'enabled' => true,
        'id' => (string) ($meeting['id'] ?? ''),
        'uuid' => (string) ($meeting['uuid'] ?? ''),
        'join_url' => (string) (($registrant['join_url'] ?? '') ?: ($meeting['join_url'] ?? '')),
        'host_join_url' => (string) ($meeting['join_url'] ?? ''),
        'start_url' => (string) ($meeting['start_url'] ?? ''),
        'password' => (string) ($meeting['password'] ?? ''),
        'start_time' => (string) ($meeting['start_time'] ?? ''),
        'timezone' => (string) ($meeting['timezone'] ?? $timezone),
    ];
}

function smtp_read($socket): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (preg_match('/^\d{3} /', $line)) {
            break;
        }
    }
    return $response;
}

function smtp_command($socket, string $command, array $acceptedCodes): string
{
    if ($command !== '') {
        fwrite($socket, $command . "\r\n");
    }
    $response = smtp_read($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $acceptedCodes, true)) {
        throw new RuntimeException('SMTP command failed with code ' . $code . '.');
    }
    return $response;
}

function encode_header(string $value): string
{
    return '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function html_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function render_rows(array $fields): string
{
    $rows = '';
    foreach ($fields as $label => $value) {
        $display = (string) ($value !== '' ? $value : '-');
        $safeValue = html_escape($display);
        if (preg_match('/^https?:\/\//i', $display)) {
            $safeValue = '<a href="' . $safeValue . '" style="color:#202124;text-decoration:underline;">' . $safeValue . '</a>';
        } else {
            $safeValue = nl2br($safeValue);
        }
        $rows .= '<tr><td style="padding:11px 13px;border-bottom:1px solid #ecece8;color:#6c6e73;font-size:12px;font-weight:700;text-transform:uppercase;width:34%;vertical-align:top;">' . html_escape((string) $label) . '</td><td style="padding:11px 13px;border-bottom:1px solid #ecece8;color:#202124;font-size:14px;line-height:1.45;vertical-align:top;">' . $safeValue . '</td></tr>';
    }
    return $rows;
}

function create_email_content(array $data, array $zoom, DateTimeImmutable $meetingStart): array
{
    $meetingTime = $meetingStart->format('l, F j, Y g:i A T');
    $fields = [
        'Name' => clean_string($data['name'] ?? '', 160),
        'Work email' => clean_string($data['email'] ?? '', 254),
        'Company' => clean_string($data['company'] ?? '', 160),
        'Website' => clean_string($data['website'] ?? '', 250),
        'Buyer procurement system' => clean_string($data['platform'] ?? '', 120),
        'Commerce platform' => clean_string($data['storePlatform'] ?? '', 120),
        'Meeting time' => $meetingTime,
        'Visitor timezone' => clean_string($data['timezone'] ?? '', 80),
        'Buyer request' => clean_string($data['message'] ?? '', 2000),
        'Zoom join link' => clean_string($zoom['join_url'] ?? '', 500),
        'Zoom host start link' => clean_string($zoom['start_url'] ?? '', 1000),
        'Zoom meeting ID' => clean_string($zoom['id'] ?? '', 80),
        'Zoom passcode' => clean_string($zoom['password'] ?? '', 80),
        'Page' => clean_string($data['page'] ?? '', 500),
        'IP' => $_SERVER['REMOTE_ADDR'] ?? '',
        'User agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
    ];

    $subject = 'New PunchOut demo request - ' . (clean_string($data['company'] ?? '', 120) ?: 'PunchOut Central website');
    $summary = 'A lead submitted the PunchOut Central Book Demo form and selected a meeting slot.';
    $textLines = [];
    foreach ($fields as $label => $value) {
        $textLines[] = $label . ': ' . ($value !== '' ? $value : '-');
    }
    $html = '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f5f7f3;font-family:Arial,Helvetica,sans-serif;color:#202124;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:28px 12px;background:#f5f7f3;"><tr><td align="center"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border:1px solid #ecece8;border-radius:18px;overflow:hidden;"><tr><td style="background:#202124;color:#ffffff;padding:24px 28px;"><div style="font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#99FEEC;margin-bottom:10px;">PunchOut Central Website</div><h1 style="margin:0;font-size:24px;line-height:1.2;">New Book Demo Request</h1><p style="margin:10px 0 0;color:#f5f5f3;font-size:14px;line-height:1.5;">' . html_escape($summary) . '</p></td></tr><tr><td style="padding:20px 22px 8px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #ecece8;border-radius:12px;overflow:hidden;border-collapse:separate;border-spacing:0;">' . render_rows($fields) . '</table></td></tr><tr><td style="padding:14px 28px 26px;color:#6c6e73;font-size:12px;line-height:1.5;">Reply directly to follow up with the lead.</td></tr></table></td></tr></table></body></html>';

    return [
        'subject' => $subject,
        'text' => implode("\r\n", $textLines),
        'html' => $html,
    ];
}

function send_smtp_message(string $recipient, array $content, string $replyTo): void
{
    $host = env_value('MAIL_HOST');
    $port = (int) env_value('MAIL_PORT', '587');
    $username = env_value('MAIL_USERNAME');
    $password = env_value('MAIL_PASSWORD');
    $fromAddress = env_value('MAIL_FROM_ADDRESS');
    $fromName = env_value('MAIL_FROM_NAME', 'PunchOut Central');
    $encryption = strtolower(env_value('MAIL_ENCRYPTION', 'tls'));

    if ($host === '' || $username === '' || $password === '' || $fromAddress === '') {
        throw new RuntimeException('Email is enabled but MAIL_HOST, MAIL_USERNAME, MAIL_PASSWORD, or MAIL_FROM_ADDRESS is missing.');
    }

    $remote = ($encryption === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
    $socket = stream_socket_client($remote, $errno, $errstr, 20, STREAM_CLIENT_CONNECT);
    if (!$socket) {
        throw new RuntimeException('Could not connect to SMTP server: ' . $errstr);
    }
    stream_set_timeout($socket, 20);

    try {
        smtp_command($socket, '', [220]);
        smtp_command($socket, 'EHLO punchoutcentral.com', [250]);

        if ($encryption === 'tls' || $encryption === 'starttls') {
            smtp_command($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('Could not enable SMTP TLS.');
            }
            smtp_command($socket, 'EHLO punchoutcentral.com', [250]);
        }

        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($username), [334]);
        smtp_command($socket, base64_encode($password), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $fromAddress . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);

        $boundary = 'punchout_' . bin2hex(random_bytes(12));
        $headers = [
            'From: "' . str_replace(['"', '\\'], '', $fromName) . '" <' . $fromAddress . '>',
            'To: <' . $recipient . '>',
            'Subject: ' . encode_header($content['subject']),
            'Reply-To: <' . $replyTo . '>',
            'MIME-Version: 1.0',
            'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
            'X-Mailer: PunchOut Central Website Form',
        ];

        $message = implode("\r\n", [
            implode("\r\n", $headers),
            '',
            '--' . $boundary,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode(str_replace(["\r\n", "\n"], "\r\n", $content['text']))),
            '--' . $boundary,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: base64',
            '',
            chunk_split(base64_encode($content['html'])),
            '--' . $boundary . '--',
            '',
        ]);

        $message = preg_replace('/^\./m', '..', $message) ?? $message;
        smtp_command($socket, $message . "\r\n.", [250]);
        smtp_command($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
}

function send_email(array $data, array $zoom, DateTimeImmutable $meetingStart): array
{
    if (!env_flag('BOOK_DEMO_EMAIL_ENABLED')) {
        return ['enabled' => false, 'sent' => false, 'recipients' => []];
    }

    $recipients = split_emails(env_value('BOOK_DEMO_TO', env_value('MAIL_TO')));
    if (!$recipients) {
        throw new RuntimeException('Email is enabled but BOOK_DEMO_TO or MAIL_TO does not contain a valid recipient.');
    }

    $content = create_email_content($data, $zoom, $meetingStart);
    $replyTo = clean_string($data['email'] ?? '', 254);

    foreach ($recipients as $recipient) {
        send_smtp_message($recipient, $content, $replyTo);
    }

    return ['enabled' => true, 'sent' => true, 'recipients' => $recipients];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'This endpoint only accepts POST form submissions.']);
}

try {
    $data = read_payload();

    $token = env_value('BOOK_DEMO_ENDPOINT_TOKEN');
    if ($token !== '' && !hash_equals($token, $_SERVER['HTTP_X_BOOK_DEMO_TOKEN'] ?? '')) {
        respond(403, ['ok' => false, 'message' => 'This form endpoint is not configured for this site.']);
    }

    if (clean_string($data['nickname'] ?? '') !== '') {
        respond(200, ['ok' => true, 'message' => 'Thanks. Your request has been received.']);
    }

    $required = ['name', 'email', 'company', 'platform', 'selectedDateISO', 'selectedTime', 'timezone'];
    foreach ($required as $field) {
        if (clean_string($data[$field] ?? '') === '') {
            respond(422, ['ok' => false, 'message' => 'Please complete all required fields before submitting.']);
        }
    }

    $submittedWebsite = clean_string($data['website'] ?? '', 250);
    $data['name'] = clean_string($data['name'] ?? '', 160);
    $data['email'] = clean_string($data['email'] ?? '', 254);
    $data['company'] = clean_string($data['company'] ?? '', 160);
    $data['platform'] = clean_string($data['platform'] ?? '', 120);
    $data['storePlatform'] = clean_string($data['storePlatform'] ?? '', 120);
    $data['message'] = clean_string($data['message'] ?? '', 2000);
    $data['page'] = clean_string($data['page'] ?? '', 500);
    $data['website'] = normalize_website($submittedWebsite);

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        respond(422, ['ok' => false, 'message' => 'Please enter a valid work email address.']);
    }

    if (clean_string($data['website'] ?? '') === '' && $submittedWebsite !== '') {
        respond(422, ['ok' => false, 'message' => 'Please enter a valid website domain.']);
    }

    if (isset($data['form_loaded_at']) && ctype_digit((string) $data['form_loaded_at'])) {
        $elapsedMs = (int) (microtime(true) * 1000) - (int) $data['form_loaded_at'];
        if ($elapsedMs < 1200) {
            respond(422, ['ok' => false, 'message' => 'Please wait a moment before submitting the form.']);
        }
    }

    $meetingStart = get_meeting_start($data);
    if (!$meetingStart) {
        respond(422, ['ok' => false, 'message' => 'Please choose a valid demo date and time.']);
    }

    $zoom = create_zoom_meeting($data, $meetingStart);
    $email = send_email($data, $zoom, $meetingStart);

    respond(200, [
        'ok' => true,
        'message' => 'Thanks. Your demo request has been received.',
        'email' => [
            'enabled' => $email['enabled'],
            'sent' => $email['sent'],
        ],
        'zoom' => [
            'enabled' => (bool) ($zoom['enabled'] ?? false),
            'id' => $zoom['id'] ?? '',
            'join_url' => $zoom['join_url'] ?? '',
            'password' => $zoom['password'] ?? '',
        ],
    ]);
} catch (Throwable $error) {
    error_log('PunchOut book-demo form failed: ' . $error->getMessage());
    respond(500, [
        'ok' => false,
        'message' => 'We could not send your request right now. Please try again or email the PunchOut Central team directly.',
    ]);
}
