<?php
$path = $_SERVER['REQUEST_URI'];
$origin = 'https://d2bygvuxl0u6xb.cloudfront.net';

// ── Hidden staff gateway to the on-prem OpenEMR ──────────────────
// Short-circuit /emr paths: issue a browser-level 307 so the client
// jumps to the tunnel URL directly. This keeps OpenEMR's absolute
// asset paths (e.g. /public/themes/...) functional because the
// browser will then be at the tunnel origin, not iyamedical.com.
if (preg_match('#^/emr(/|$|\?)#', $path)) {
    $emrBase = 'https://retain-universities-pay-entrance.trycloudflare.com';
    $suffix = substr($path, 4); // strip "/emr"
    if ($suffix === '' || $suffix[0] !== '/') { $suffix = '/' . ltrim($suffix, '?'); }
    $dest = $emrBase . $suffix;
    header('Location: ' . $dest, true, 307);
    header('Cache-Control: no-store, no-cache, must-revalidate');
    exit;
}

$ch = curl_init($origin . $path);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_ENCODING, '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

if ($response === false) {
    http_response_code(502);
    echo 'Service unavailable';
    exit;
}

$headers = substr($response, 0, $headerSize);
$body = substr($response, $headerSize);

http_response_code($httpCode);

// Determine correct MIME type from extension
$ext = strtolower(pathinfo(parse_url($path, PHP_URL_PATH), PATHINFO_EXTENSION));
$mimeMap = [
    'css' => 'text/css; charset=UTF-8',
    'js' => 'application/javascript; charset=UTF-8',
    'json' => 'application/json; charset=UTF-8',
    'html' => 'text/html; charset=UTF-8',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'webp' => 'image/webp',
    'ico' => 'image/x-icon',
    'woff' => 'font/woff',
    'woff2' => 'font/woff2',
    'ttf' => 'font/ttf',
    'eot' => 'application/vnd.ms-fontobject',
    'xml' => 'application/xml',
    'txt' => 'text/plain',
    'map' => 'application/json',
];

if (isset($mimeMap[$ext])) {
    header('Content-Type: ' . $mimeMap[$ext]);
} else {
    foreach (explode("\r\n", $headers) as $h) {
        if (stripos($h, 'Content-Type:') === 0) {
            header($h);
            break;
        }
    }
    if (empty($ext)) {
        header('Content-Type: text/html; charset=UTF-8');
    }
}

foreach (explode("\r\n", $headers) as $h) {
    if (preg_match('/^(Cache-Control|ETag|Last-Modified|Vary):/i', $h)) {
        header($h);
    }
}

if ($httpCode >= 300 && $httpCode < 400) {
    foreach (explode("\r\n", $headers) as $h) {
        if (stripos($h, 'Location:') === 0) {
            $loc = trim(substr($h, 9));
            $loc = str_replace($origin, '', $loc);
            header('Location: ' . $loc);
            break;
        }
    }
}

echo $body;
