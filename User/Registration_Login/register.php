<?php
// Registration logic: Save new user to users.json

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');

    $usersFile = __DIR__ . '/users.json';
    $usersData = ["users" => []];

    if (file_exists($usersFile) && is_readable($usersFile)) {
        $rawData = file_get_contents($usersFile);
        $decoded = json_decode($rawData, true);
        if (is_array($decoded)) {
            $usersData = $decoded;
        }
    }

    $users = isset($usersData['users']) && is_array($usersData['users']) ? $usersData['users'] : [];

    // Check if username already exists
    $exists = false;
    foreach ($users as $user) {
        if (is_array($user) && ($user['username'] ?? '') === $username) {
            $exists = true;
            break;
        }
    }

    if ($exists) {
        header('Location: register.html?error=exists');
        exit();
    }

    // Add new user
    $users[] = [
        'username' => $username,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'first_name' => $firstName,
        'last_name' => $lastName
    ];
    $usersData['users'] = $users;
    file_put_contents($usersFile, json_encode($usersData, JSON_PRETTY_PRINT));
    header('Location: login_page.html?registered=1');
    exit();
}
?>
