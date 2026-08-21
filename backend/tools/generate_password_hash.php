<?php

if (PHP_SAPI !== 'cli') {
    exit("Run this file from a terminal with PHP CLI.\n");
}

$password = $argv[1] ?? null;
$email = $argv[2] ?? null;

if ($password === null) {
    $password = readline('Password to hash: ');
}

if ($email === null) {
    $email = readline('User email: ');
}

if ($password === false || $password === '') {
    fwrite(STDERR, "A non-empty password is required.\n");
    exit(1);
}

if ($email === false || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fwrite(STDERR, "A valid email address is required.\n");
    exit(1);
}

$hash = password_hash($password, PASSWORD_DEFAULT);

if ($hash === false) {
    fwrite(STDERR, "Unable to generate password hash.\n");
    exit(1);
}

echo "Password hash:\n{$hash}\n\n";
echo "SQL for phpMyAdmin:\n";
echo "UPDATE users SET password_hash = '" . addslashes($hash) . "' WHERE email = '" . addslashes($email) . "';\n";
