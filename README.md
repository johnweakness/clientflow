# ClientFlow

ClientFlow is a full-stack client and task management dashboard built to demonstrate a junior web developer's practical skills with React, JavaScript, PHP, MySQL, and REST APIs.

## Features

- Secure login/logout flow with PHP sessions and hashed passwords
- Dashboard with live KPIs for clients and tasks
- Client management with search, filter, add, edit, delete, and details view
- Global task tracking with status, priority, and due date filters
- Responsive admin dashboard layout with mobile navigation
- JSON-based PHP REST API with PDO and prepared statements
- Demo data seeded into MySQL for quick portfolio review

## Tech Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React
- Backend: PHP, PDO, MySQL, session-based auth, JSON responses
- Database: MySQL
- Workflow: Git/GitHub, XAMPP local development

## Architecture

React → PHP REST API → MySQL

## Screenshots

Add screenshots later from a local browser preview.

## Installation

1. Clone the repository.
2. Install the frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Set up MySQL and import the schema and seed data.
4. Run the PHP API under XAMPP or a local PHP server.
5. Start the React frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Database Setup

Import the SQL files in this order:

```sql
mysql -u your_user -p < database/schema.sql
mysql -u your_user -p < database/seed.sql
```

## Environment / Configuration

Update the database configuration in `backend/config/database.php` if your XAMPP credentials differ.

Default local credentials used by this project:

```php
DB_HOST = '127.0.0.1'
DB_PORT = '3306'
DB_NAME = 'clientflow'
DB_USER = 'root'
DB_PASS = ''
```

## Running the React Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite's default local port, typically `http://localhost:5173`.

## Running the PHP API with XAMPP

1. Start Apache and MySQL in XAMPP.
2. Place the project in `htdocs` or an equivalent local web root.
3. Make sure the document root serves the `backend/public` folder or use a virtual host pointing there.
4. Visit the route through the PHP backend such as:
   ```text
   http://localhost/clientflow/backend/public/api/auth/login.php
   ```

## Demo Login

Email: `demo@clientflow.test`
Password: `Demo123!`

## API Endpoints

- `POST /api/auth/login.php`
- `POST /api/auth/logout.php`
- `GET /api/auth/me.php`
- `GET /api/clients/`
- `POST /api/clients/`
- `PUT /api/clients/?id=1`
- `DELETE /api/clients/?id=1`
- `GET /api/tasks/`
- `POST /api/tasks/`
- `PUT /api/tasks/?id=1`
- `DELETE /api/tasks/?id=1`
- `GET /api/dashboard/stats.php`

## Project Structure

```text
clientflow/
├── frontend/
├── backend/
├── database/
├── README.md
├── .gitignore
└── .
```

## What This Project Demonstrates

- React component development
- JavaScript
- PHP backend development
- REST API development
- MySQL/SQL
- CRUD operations
- Authentication
- API integration
- Responsive web development
- Error handling
- Loading states
- Git/GitHub workflow

