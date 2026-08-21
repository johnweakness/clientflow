<?php

function getDatabaseUrl(): string
{
    $databaseUrl = getenv('DATABASE_URL');

    if ($databaseUrl !== false && $databaseUrl !== '') {
        return $databaseUrl;
    }

    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '5432';
    $name = getenv('DB_NAME') ?: 'clientflow';
    $user = getenv('DB_USER') ?: 'postgres';
    $password = getenv('DB_PASS') ?: '';

    return "postgresql://{$user}:{$password}@{$host}:{$port}/{$name}?sslmode=require";
}

function getDatabaseConnection(): PDO
{
    $parts = parse_url(getDatabaseUrl());

    if ($parts === false || empty($parts['host']) || empty($parts['path'])) {
        throw new InvalidArgumentException('DATABASE_URL is invalid.');
    }

    $dsn = 'pgsql:host=' . $parts['host'] . ';port=' . ($parts['port'] ?? 5432)
        . ';dbname=' . ltrim($parts['path'], '/') . ';sslmode=require';
    $username = isset($parts['user']) ? rawurldecode($parts['user']) : '';
    $password = isset($parts['pass']) ? rawurldecode($parts['pass']) : '';

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    return new PDO($dsn, $username, $password, $options);
}
