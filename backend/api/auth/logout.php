<?php

require_once __DIR__ . '/../../helpers/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (getRequestMethod() !== 'POST') {
    sendJson([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}

session_destroy();

sendJson([
    'success' => true,
    'message' => 'Logged out successfully.',
], 200);
