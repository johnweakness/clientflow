<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

$userId = requireAuth();

$method = getRequestMethod();

try {
    $pdo = getDatabaseConnection();

    if ($method === 'GET') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

        if ($id !== null) {
            $stmt = $pdo->prepare('SELECT * FROM clients WHERE id = :id AND user_id = :user_id LIMIT 1');
            $stmt->execute([':id' => $id, ':user_id' => $userId]);
            $client = $stmt->fetch();

            if (!$client) {
                sendJson([
                    'success' => false,
                    'message' => 'Client not found.',
                ], 404);
            }

            sendJson([
                'success' => true,
                'data' => $client,
            ], 200);
        }

        $search = $_GET['search'] ?? '';
        $status = $_GET['status'] ?? '';
        $sort = $_GET['sort'] ?? 'created_at';
        $direction = $_GET['direction'] ?? 'desc';

        $sql = 'SELECT * FROM clients WHERE user_id = :user_id';
        $params = [':user_id' => $userId];

        if ($search !== '') {
            $sql .= ' AND (client_name LIKE :search OR company_name LIKE :search OR email LIKE :search OR project_service LIKE :search)';
            $params[':search'] = '%' . $search . '%';
        }

        if ($status !== '') {
            $sql .= ' AND status = :status';
            $params[':status'] = $status;
        }

        $allowedSorts = ['client_name', 'company_name', 'created_at', 'updated_at', 'status'];
        $sortField = in_array($sort, $allowedSorts, true) ? $sort : 'created_at';
        $direction = strtoupper($direction) === 'ASC' ? 'ASC' : 'DESC';

        $sql .= ' ORDER BY ' . $sortField . ' ' . $direction;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $clients = $stmt->fetchAll();

        sendJson([
            'success' => true,
            'data' => $clients,
        ], 200);
    }

    if ($method === 'POST') {
        $data = readJsonBody();

        $clientName = normalizeString($data['client_name'] ?? '', 120);
        $companyName = normalizeString($data['company_name'] ?? '', 150);
        $email = normalizeString($data['email'] ?? '', 150);
        $phone = normalizeString($data['phone'] ?? '', 50);
        $projectService = normalizeString($data['project_service'] ?? '', 180);
        $status = $data['status'] ?? 'Lead';
        $notes = isset($data['notes']) ? trim((string) $data['notes']) : '';

        if ($clientName === '' || $companyName === '' || $email === '' || $projectService === '') {
            sendJson([
                'success' => false,
                'message' => 'Name, company, email, and project/service are required.',
            ], 422);
        }

        if (!isValidEmail($email)) {
            sendJson([
                'success' => false,
                'message' => 'Please provide a valid email address.',
            ], 422);
        }

        $validStatuses = ['Lead', 'Active', 'On Hold', 'Completed'];
        if (!in_array($status, $validStatuses, true)) {
            sendJson([
                'success' => false,
                'message' => 'Status is invalid.',
            ], 422);
        }

        $stmt = $pdo->prepare('INSERT INTO clients (user_id, client_name, company_name, email, phone, project_service, status, notes) VALUES (:user_id, :client_name, :company_name, :email, :phone, :project_service, :status, :notes)');
        $stmt->execute([
            ':user_id' => $userId,
            ':client_name' => $clientName,
            ':company_name' => $companyName,
            ':email' => $email,
            ':phone' => $phone,
            ':project_service' => $projectService,
            ':status' => $status,
            ':notes' => $notes,
        ]);

        $clientId = (int) $pdo->lastInsertId();

        $createdStmt = $pdo->prepare('SELECT * FROM clients WHERE id = :id AND user_id = :user_id LIMIT 1');
        $createdStmt->execute([':id' => $clientId, ':user_id' => $userId]);
        $client = $createdStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'Client created successfully.',
            'data' => $client,
        ], 201);
    }

    if ($method === 'PUT') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        if ($id === null) {
            sendJson([
                'success' => false,
                'message' => 'Client ID is required.',
            ], 400);
        }

        $data = readJsonBody();
        $clientName = normalizeString($data['client_name'] ?? '', 120);
        $companyName = normalizeString($data['company_name'] ?? '', 150);
        $email = normalizeString($data['email'] ?? '', 150);
        $phone = normalizeString($data['phone'] ?? '', 50);
        $projectService = normalizeString($data['project_service'] ?? '', 180);
        $status = $data['status'] ?? 'Lead';
        $notes = isset($data['notes']) ? trim((string) $data['notes']) : '';

        if ($clientName === '' || $companyName === '' || $email === '' || $projectService === '') {
            sendJson([
                'success' => false,
                'message' => 'Name, company, email, and project/service are required.',
            ], 422);
        }

        if (!isValidEmail($email)) {
            sendJson([
                'success' => false,
                'message' => 'Please provide a valid email address.',
            ], 422);
        }

        $validStatuses = ['Lead', 'Active', 'On Hold', 'Completed'];
        if (!in_array($status, $validStatuses, true)) {
            sendJson([
                'success' => false,
                'message' => 'Status is invalid.',
            ], 422);
        }

        $checkStmt = $pdo->prepare('SELECT id FROM clients WHERE id = :id AND user_id = :user_id LIMIT 1');
        $checkStmt->execute([':id' => $id, ':user_id' => $userId]);

        if (!$checkStmt->fetch()) {
            sendJson([
                'success' => false,
                'message' => 'Client not found.',
            ], 404);
        }

        $stmt = $pdo->prepare('UPDATE clients SET client_name = :client_name, company_name = :company_name, email = :email, phone = :phone, project_service = :project_service, status = :status, notes = :notes, updated_at = CURRENT_TIMESTAMP WHERE id = :id AND user_id = :user_id');
        $stmt->execute([
            ':client_name' => $clientName,
            ':company_name' => $companyName,
            ':email' => $email,
            ':phone' => $phone,
            ':project_service' => $projectService,
            ':status' => $status,
            ':notes' => $notes,
            ':id' => $id,
            ':user_id' => $userId,
        ]);

        $updatedStmt = $pdo->prepare('SELECT * FROM clients WHERE id = :id AND user_id = :user_id LIMIT 1');
        $updatedStmt->execute([':id' => $id, ':user_id' => $userId]);
        $client = $updatedStmt->fetch();

        sendJson([
            'success' => true,
            'message' => 'Client updated successfully.',
            'data' => $client,
        ], 200);
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;
        if ($id === null) {
            sendJson([
                'success' => false,
                'message' => 'Client ID is required.',
            ], 400);
        }

        $checkStmt = $pdo->prepare('SELECT id FROM clients WHERE id = :id AND user_id = :user_id LIMIT 1');
        $checkStmt->execute([':id' => $id, ':user_id' => $userId]);

        if (!$checkStmt->fetch()) {
            sendJson([
                'success' => false,
                'message' => 'Client not found.',
            ], 404);
        }

        $stmt = $pdo->prepare('DELETE FROM clients WHERE id = :id AND user_id = :user_id');
        $stmt->execute([':id' => $id, ':user_id' => $userId]);

        sendJson([
            'success' => true,
            'message' => 'Client deleted successfully.',
        ], 200);
    }

    sendJson([
        'success' => false,
        'message' => 'Unsupported request method.',
    ], 405);
} catch (Throwable $e) {
    sendJson([
        'success' => false,
        'message' => 'Unable to process client request.',
    ], 500);
}
