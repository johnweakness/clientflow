<?php

function configureCors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ];

    if (in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

configureCors();

if (getRequestMethod() === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function sendJson(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonBody(): array
{
    $rawBody = file_get_contents('php://input');

    if ($rawBody === false || trim($rawBody) === '') {
        return [];
    }

    $decoded = json_decode($rawBody, true);

    return is_array($decoded) ? $decoded : [];
}

function getRequestMethod(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}

function currentUserId(): ?int
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    return isset($_SESSION['user_id']) ? (int) $_SESSION['user_id'] : null;
}

function requireAuth(): int
{
    $userId = currentUserId();

    if ($userId === null) {
        sendJson([
            'success' => false,
            'message' => 'Unauthorized. Please log in again.',
        ], 401);
    }

    return $userId;
}

function normalizeString(?string $value, int $maxLength = 255): string
{
    return trim(substr($value ?? '', 0, $maxLength));
}

function isValidEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function ensurePostMethod(): void
{
    if (getRequestMethod() !== 'POST') {
        sendJson([
            'success' => false,
            'message' => 'This endpoint only accepts POST requests.',
        ], 405);
    }
}
