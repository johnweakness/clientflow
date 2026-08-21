<?php

if (PHP_SAPI !== 'cli') {
    exit("Run this file from a terminal with PHP CLI.\n");
}

$password = $argv[1] ?? null;

if ($password === null) {
    $password = readline('Password to hash: ');
}

if ($password === false || $password === '') {
    fwrite(STDERR, "A non-empty password is required.\n");
    exit(1);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

if ($hash === false) {
    fwrite(STDERR, "Unable to generate password hash.\n");
    exit(1);
}

echo "Password hash:\n{$hash}\n\n";
echo "SQL for phpMyAdmin:\n";
echo "UPDATE users SET password_hash = '" . addslashes($hash) . "' WHERE email = 'demo@clientflow.test';\n";
