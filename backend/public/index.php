<?php

require_once __DIR__ . '/../helpers/response.php';

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$uri = strtok($uri, '?');

$routes = [
    '/api/auth/login.php' => __DIR__ . '/../api/auth/login.php',
    '/api/auth/logout.php' => __DIR__ . '/../api/auth/logout.php',
    '/api/auth/me.php' => __DIR__ . '/../api/auth/me.php',
    '/api/clients/' => __DIR__ . '/../api/clients/index.php',
    '/api/tasks/' => __DIR__ . '/../api/tasks/index.php',
    '/api/dashboard/stats.php' => __DIR__ . '/../api/dashboard/stats.php',
];

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendJson(['success' => true], 200);
}

if (isset($routes[$uri])) {
    require $routes[$uri];
}

sendJson([
    'success' => false,
    'message' => 'Route not found.',
], 404);
