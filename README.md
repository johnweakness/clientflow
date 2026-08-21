# ClientFlow

ClientFlow is a full-stack client and task management dashboard built to demonstrate a junior web developer's practical skills with React, JavaScript, PHP, PostgreSQL, and REST APIs.

## Features

- Secure login/logout flow with PHP sessions and hashed passwords
- Dashboard with live KPIs for clients and tasks
- Client management with search, filter, add, edit, delete, and details view
- Global task tracking with status, priority, and due date filters
- Responsive admin dashboard layout with mobile navigation
- JSON-based PHP REST API with PDO and prepared statements
- Demo data seeded into PostgreSQL for quick portfolio review

## Tech Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React
- Backend: PHP, PDO PostgreSQL, session-based auth, JSON responses
- Database: Neon PostgreSQL
- Workflow: Git/GitHub, Vercel frontend, PHP hosting backend

## Architecture

React → Vercel Serverless API → Neon PostgreSQL

## Screenshots

Add screenshots later from a local browser preview.

## Installation

1. Clone the repository.
2. Install the frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Create a Neon PostgreSQL database and run `database/schema.sql`, followed by `database/seed.sql`.
4. Set the `DATABASE_URL` environment variable for the PHP API.
5. Start the React frontend:
   ```bash
   cd frontend
   npm run dev
   ```

## Database Setup

Import the SQL files in this order:

```sql
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

## Environment / Configuration

Set `DATABASE_URL` to the connection string from Neon. The PHP backend also supports separate `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASS` variables.

Example local PostgreSQL fallback values:

```php
DB_HOST = '127.0.0.1'
DB_PORT = '5432'
DB_NAME = 'clientflow'
DB_USER = 'postgres'
DB_PASS = ''
```

## Running the React Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite's default local port, typically `http://localhost:5173`.

## Deploying the PHP API

1. Upload the `backend` folder to a PHP host.
2. Configure `DATABASE_URL` with the Neon connection string.
3. Make sure the document root serves the `backend/public` folder or use a virtual host pointing there.
4. Test the route through the PHP backend such as:
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
- PostgreSQL/SQL
- CRUD operations
- Authentication
- API integration
- Responsive web development
- Error handling
- Loading states
- Git/GitHub workflow

