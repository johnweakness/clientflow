<?php

const DB_HOST = '127.0.0.1';
const DB_PORT = '3306';
const DB_NAME = 'clientflow';
const DB_USER = 'root';
const DB_PASS = '';

function getDatabaseConnection(): PDO
{
    $dsn = 'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4';

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    return new PDO($dsn, DB_USER, DB_PASS, $options);
}
