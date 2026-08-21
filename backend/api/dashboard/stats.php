<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

$userId = requireAuth();

if (getRequestMethod() !== 'GET') {
    sendJson([
        'success' => false,
        'message' => 'Method not allowed.',
    ], 405);
}

try {
    $pdo = getDatabaseConnection();

    $statsQuery = "SELECT
        (SELECT COUNT(*) FROM clients WHERE user_id = :total_clients_user_id) AS total_clients,
        (SELECT COUNT(*) FROM clients WHERE user_id = :active_clients_user_id AND status = 'Active') AS active_clients,
        (SELECT COUNT(*) FROM clients WHERE user_id = :completed_clients_user_id AND status = 'Completed') AS completed_clients,
        (SELECT COUNT(*) FROM clients WHERE user_id = :pending_clients_user_id AND status = 'Lead') AS pending_clients,
        (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = :total_tasks_user_id) AS total_tasks,
        (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = :tasks_due_soon_user_id AND t.status != 'Completed' AND t.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days') AS tasks_due_soon,
        (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = :overdue_tasks_user_id AND t.status != 'Completed' AND t.due_date < CURRENT_DATE) AS overdue_tasks,
        (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = :completed_tasks_user_id AND t.status = 'Completed') AS completed_tasks";

    $stmt = $pdo->prepare($statsQuery);
    $stmt->execute([
        ':total_clients_user_id' => $userId,
        ':active_clients_user_id' => $userId,
        ':completed_clients_user_id' => $userId,
        ':pending_clients_user_id' => $userId,
        ':total_tasks_user_id' => $userId,
        ':tasks_due_soon_user_id' => $userId,
        ':overdue_tasks_user_id' => $userId,
        ':completed_tasks_user_id' => $userId,
    ]);
    $stats = $stmt->fetch();

    $statusQuery = 'SELECT status, COUNT(*) as total FROM clients WHERE user_id = :user_id GROUP BY status';
    $statusStmt = $pdo->prepare($statusQuery);
    $statusStmt->execute([':user_id' => $userId]);
    $statusBreakdown = $statusStmt->fetchAll();

    $recentClientsQuery = 'SELECT * FROM clients WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 5';
    $recentClientsStmt = $pdo->prepare($recentClientsQuery);
    $recentClientsStmt->execute([':user_id' => $userId]);
    $recentClients = $recentClientsStmt->fetchAll();

    $upcomingTasksQuery = 'SELECT t.*, c.client_name, c.company_name FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = :user_id AND t.status != "Completed" ORDER BY t.due_date ASC, t.priority DESC LIMIT 5';
    $upcomingTasksStmt = $pdo->prepare($upcomingTasksQuery);
    $upcomingTasksStmt->execute([':user_id' => $userId]);
    $upcomingTasks = $upcomingTasksStmt->fetchAll();

    $response = [
        'total_clients' => (int) ($stats['total_clients'] ?? 0),
        'active_clients' => (int) ($stats['active_clients'] ?? 0),
        'completed_clients' => (int) ($stats['completed_clients'] ?? 0),
        'pending_clients' => (int) ($stats['pending_clients'] ?? 0),
        'total_tasks' => (int) ($stats['total_tasks'] ?? 0),
        'tasks_due_soon' => (int) ($stats['tasks_due_soon'] ?? 0),
        'overdue_tasks' => (int) ($stats['overdue_tasks'] ?? 0),
        'completed_tasks' => (int) ($stats['completed_tasks'] ?? 0),
        'status_breakdown' => [
            'Lead' => 0,
            'Active' => 0,
            'On Hold' => 0,
            'Completed' => 0,
        ],
        'recent_clients' => $recentClients,
        'upcoming_tasks' => $upcomingTasks,
    ];

    foreach ($statusBreakdown as $item) {
        $response['status_breakdown'][$item['status']] = (int) $item['total'];
    }

    sendJson([
        'success' => true,
        'data' => $response,
    ], 200);
} catch (Throwable $e) {
    sendJson([
        'success' => false,
        'message' => 'Unable to load dashboard data right now.',
    ], 500);
}
