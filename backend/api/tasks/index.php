<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

$userId = requireAuth();

$method = getRequestMethod();

try {
    $pdo = getDatabaseConnection();

    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        $clientId = isset($_GET['client_id']) ? (int) $_GET['client_id'] : null;

        if ($id !== null) {
            $stmt = $pdo->prepare('SELECT t.* FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE t.id = :id AND c.user_id = :user_id LIMIT 1');
            $stmt->execute([':id' => $id, ':user_id' => $userId]);
            $task = $stmt->fetch();

            if (!$task) {
                sendJson([
                    'success' => false,
                    'message' => 'Task not found.',
                ], 404);
            }

            sendJson([
                'success' => true,
                'data' => $task,
            ], 200);
        }

        if ($clientId !== null) {
            $stmt = $pdo->prepare('SELECT t.* FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE t.client_id = :client_id AND c.user_id = :user_id ORDER BY t.due_date IS NULL, t.due_date ASC, t.created_at DESC');
            $stmt->execute([':client_id' => $clientId, ':user_id' => $userId]);
            $tasks = $stmt->fetchAll();

            sendJson([
                'success' => true,
                'data' => $tasks,
            ], 200);
        }

        $search = $_GET['search'] ?? '';
        $status = $_GET['status'] ?? '';
        $priority = $_GET['priority'] ?? '';
        $sort = $_GET['sort'] ?? 'due_date';
        $direction = $_GET['direction'] ?? 'asc';

        $sql = 'SELECT t.*, c.client_name, c.company_name FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = :user_id';
        $params = [':user_id' => $userId];

        if ($search !== '') {
            $sql .= ' AND (t.title LIKE :search OR t.description LIKE :search OR c.client_name LIKE :search OR c.company_name LIKE :search)';
            $params[':search'] = '%' . $search . '%';
        }

        if ($status !== '') {
            $sql .= ' AND t.status = :status';
            $params[':status'] = $status;
        }

        if ($priority !== '') {
            $sql .= ' AND t.priority = :priority';
            $params[':priority'] = $priority;
        }

        $allowedSorts = ['due_date', 'title', 'priority', 'status', 'created_at'];
        $sortField = in_array($sort, $allowedSorts, true) ? $sort : 'due_date';
        $direction = strtoupper($direction) === 'DESC' ? 'DESC' : 'ASC';

        $sql .= ' ORDER BY ' . $sortField . ' ' . $direction . ', t.created_at DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $tasks = $stmt->fetchAll();

        sendJson([
            'success' => true,
            'data' => $tasks,
        ], 200);
    }

    if ($method === 'POST') {
        $data = readJsonBody();

        $clientId = isset($data['client_id']) ? (int) $data['client_id'] : 0;
        $title = normalizeString($data['title'] ?? '', 180);
        $description = isset($data['description']) ? trim((string) $data['description']) : '';
        $status = $data['status'] ?? 'To Do';
        $priority = $data['priority'] ?? 'Medium';
        $dueDate = isset($data['due_date']) && $data['due_date'] !== '' ? trim((string) $data['due_date']) : null;

        if ($clientId <= 0 || $title === '') {
            sendJson([
                'success' => false,
                'message' => 'Client and task title are required.',
            ], 422);
        }

        $clientCheck = $pdo->prepare('SELECT id FROM clients WHERE id = :id AND user_id = :user_id LIMIT 1');
        $clientCheck->execute([':id' => $clientId, ':user_id' => $userId]);
        if (!$clientCheck->fetch()) {
            sendJson([
                'success' => false,
                'message' => 'Client not found.',
            ], 404);
        }

        $validStatuses = ['To Do', 'In Progress', 'Completed'];
        $validPriorities = ['Low', 'Medium', 'High'];

        if (!in_array($status, $validStatuses, true)) {
            sendJson([
                'success' => false,
                'message' => 'Task status is invalid.',
            ], 422);
        }

        if (!in_array($priority, $validPriorities, true)) {
            sendJson([
                'success' => false,
                'message' => 'Priority is invalid.',
            ], 422);
        }

        if ($dueDate !== null && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dueDate)) {
            sendJson([
                'success' => false,
                'message' => 'Due date must use the format YYYY-MM-DD.',
            ], 422);
        }

        $stmt = $pdo->prepare('INSERT INTO tasks (client_id, title, description, status, priority, due_date) VALUES (:client_id, :title, :description, :status, :priority, :due_date)');
        $stmt->execute([
            ':client_id' => $clientId,
            ':title' => $title,
            ':description' => $description,
            ':status' => $status,
            ':priority' => $priority,
            ':due_date' => $dueDate,
        ]);

        $taskId = (int) $pdo->lastInsertId();
        $createdStmt = $pdo->prepare('SELECT * FROM tasks WHERE id = :id LIMIT 1');
        $createdStmt->execute([':id' => $taskId]);
        $task = $createdStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'Task created successfully.',
            'data' => $task,
        ], 201);
    }

    if ($method === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        if ($id === null) {
            sendJson([
                'success' => false,
                'message' => 'Task ID is required.',
            ], 400);
        }

        $data = readJsonBody();
        $taskCheck = $pdo->prepare('SELECT t.id FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE t.id = :id AND c.user_id = :user_id LIMIT 1');
        $taskCheck->execute([':id' => $id, ':user_id' => $userId]);

        if (!$taskCheck->fetch()) {
            sendJson([
                'success' => false,
                'message' => 'Task not found.',
            ], 404);
        }

        $title = normalizeString($data['title'] ?? '', 180);
        $description = isset($data['description']) ? trim((string) $data['description']) : '';
        $status = $data['status'] ?? 'To Do';
        $priority = $data['priority'] ?? 'Medium';
        $dueDate = isset($data['due_date']) && $data['due_date'] !== '' ? trim((string) $data['due_date']) : null;

        if ($title === '') {
            sendJson([
                'success' => false,
                'message' => 'Task title is required.',
            ], 422);
        }

        $validStatuses = ['To Do', 'In Progress', 'Completed'];
        $validPriorities = ['Low', 'Medium', 'High'];

        if (!in_array($status, $validStatuses, true)) {
            sendJson([
                'success' => false,
                'message' => 'Task status is invalid.',
            ], 422);
        }

        if (!in_array($priority, $validPriorities, true)) {
            sendJson([
                'success' => false,
                'message' => 'Priority is invalid.',
            ], 422);
        }

        if ($dueDate !== null && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $dueDate)) {
            sendJson([
                'success' => false,
                'message' => 'Due date must use the format YYYY-MM-DD.',
            ], 422);
        }

        $stmt = $pdo->prepare('UPDATE tasks SET title = :title, description = :description, status = :status, priority = :priority, due_date = :due_date, updated_at = CURRENT_TIMESTAMP WHERE id = :id');
        $stmt->execute([
            ':title' => $title,
            ':description' => $description,
            ':status' => $status,
            ':priority' => $priority,
            ':due_date' => $dueDate,
            ':id' => $id,
        ]);

        $updatedStmt = $pdo->prepare('SELECT * FROM tasks WHERE id = :id LIMIT 1');
        $updatedStmt->execute([':id' => $id]);
        $task = $updatedStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'Task updated successfully.',
            'data' => $task,
        ], 200);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        if ($id === null) {
            sendJson([
                'success' => false,
                'message' => 'Task ID is required.',
            ], 400);
        }

        $taskCheck = $pdo->prepare('SELECT t.id FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE t.id = :id AND c.user_id = :user_id LIMIT 1');
        $taskCheck->execute([':id' => $id, ':user_id' => $userId]);

        if (!$taskCheck->fetch()) {
            sendJson([
                'success' => false,
                'message' => 'Task not found.',
            ], 404);
        }

        $stmt = $pdo->prepare('DELETE FROM tasks WHERE id = :id');
        $stmt->execute([':id' => $id]);

        sendJson([
            'success' => true,
            'message' => 'Task deleted successfully.',
        ], 200);
    }

    sendJson([
        'success' => false,
        'message' => 'Unsupported request method.',
    ], 405);
} catch (Throwable $e) {
    sendJson([
        'success' => false,
        'message' => 'Unable to process task request.',
    ], 500);
}
