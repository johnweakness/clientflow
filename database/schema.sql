CREATE DATABASE IF NOT EXISTS clientflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE clientflow;

DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email)
);

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  client_name VARCHAR(120) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  project_service VARCHAR(180) NOT NULL,
  status ENUM('Lead', 'Active', 'On Hold', 'Completed') NOT NULL DEFAULT 'Lead',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_clients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_clients_user (user_id),
  INDEX idx_clients_status (status),
  INDEX idx_clients_created_at (created_at)
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  status ENUM('To Do', 'In Progress', 'Completed') NOT NULL DEFAULT 'To Do',
  priority ENUM('Low', 'Medium', 'High') NOT NULL DEFAULT 'Medium',
  due_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_tasks_client (client_id),
  INDEX idx_tasks_status (status),
  INDEX idx_tasks_due_date (due_date),
  INDEX idx_tasks_priority (priority)
);
