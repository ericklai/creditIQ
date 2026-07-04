<?php
// Simple login logic using users.json for demonstration. Replace with secure authentication in production.
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    $usersFile = __DIR__ . '/users.json';
    $usersData = [];

    if (file_exists($usersFile) && is_readable($usersFile)) {
        $rawData = file_get_contents($usersFile);
        $decoded = json_decode($rawData, true);
        if (is_array($decoded)) {
            $usersData = $decoded;
        }
    }

    $users = isset($usersData['users']) && is_array($usersData['users']) ? $usersData['users'] : [];
    $found = false;
    $userIndex = -1;

    foreach ($users as $index => $user) {
        if (!is_array($user)) {
            continue;
        }

        if (($user['username'] ?? '') === $username) {
            $storedPassword = $user['password'] ?? '';
            if (password_verify($password, $storedPassword)) {
                $found = true;
                $userIndex = $index;
                break;
            }

            if ($storedPassword !== '' && $storedPassword === $password) {
                $found = true;
                $userIndex = $index;
                break;
            }
        }
    }

    if ($found && $userIndex >= 0) {
        $storedPassword = $users[$userIndex]['password'] ?? '';
        if ($storedPassword !== '' && $storedPassword === $password) {
            $users[$userIndex]['password'] = password_hash($password, PASSWORD_DEFAULT);
            $usersData['users'] = $users;
            file_put_contents($usersFile, json_encode($usersData, JSON_PRETTY_PRINT));
        }

        $_SESSION['username'] = $username;
        header('Location: ../Dashboard/dashboard.html');
        exit();
    }

    header('Location: login_page.html?error=1');
    exit();
}
?>
