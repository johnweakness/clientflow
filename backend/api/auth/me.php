<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (getRequestMethod() !== 'GET') {
    sendJson([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

$userId = currentUserId();
if ($userId === null) {
    sendJson([
        'success' => false,
        'message' => 'Unauthorized.',
    ], 401);
}

try {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        sendJson([
            'success' => false,
            'message' => 'User not found.',
        ], 404);
    }

    sendJson([
        'success' => true,
        'data' => [
            'user' => [
                'id' => (int) $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
            ],
        ],
    ], 200);
} catch (Throwable $e) {
    sendJson([
        'success' => false,
        'message' => 'Unable to load your account.',
    ], 500);
}
