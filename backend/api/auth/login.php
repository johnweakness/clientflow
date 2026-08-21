<?php

require_once __DIR__ . '/../../config/database.php';
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

$data = readJsonBody();
$email = normalizeString($data['email'] ?? '', 150);
$password = $data['password'] ?? '';

if ($email === '' || $password === '') {
    sendJson([
        'success' => false,
        'message' => 'Email and password are required.',
    ], 422);
}

if (!isValidEmail($email)) {
    sendJson([
        'success' => false,
        'message' => 'Please enter a valid email address.',
    ], 422);
}

try {
    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('SELECT id, name, email, password_hash FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendJson([
            'success' => false,
            'message' => 'Invalid email or password.',
        ], 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_name'] = $user['name'];
    $_SESSION['user_email'] = $user['email'];

    sendJson([
        'success' => true,
        'message' => 'Login successful.',
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
        'message' => 'Unable to log in right now. Please try again.',
    ], 500);
}
