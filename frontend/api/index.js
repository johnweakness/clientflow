import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);
const sessionCookie = 'clientflow_session';

function json(res, status, payload) {
  res.status(status).json(payload);
}

function getSession(req) {
  const cookies = req.headers.cookie || '';
  const value = cookies.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${sessionCookie}=`))?.split('=')[1];
  if (!value) return null;

  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function setSession(res, user) {
  const value = Buffer.from(JSON.stringify({ id: user.id, name: user.name, email: user.email })).toString('base64url');
  res.setHeader('Set-Cookie', `${sessionCookie}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`);
}

function clearSession(res) {
  res.setHeader('Set-Cookie', `${sessionCookie}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}

function userId(req, res) {
  const session = getSession(req);
  if (!session?.id) {
    json(res, 401, { success: false, message: 'Unauthorized. Please log in again.' });
    return null;
  }
  return Number(session.id);
}

export default async function handler(req, res) {
  try {
    const path = req.url.split('?')[0].replace(/^\/api/, '') || '/';
    const body = req.body || (typeof req.body === 'string' ? JSON.parse(req.body) : {});

    if (path === '/auth/login.php' && req.method === 'POST') {
      const [user] = await sql`SELECT id, name, email, password_hash FROM users WHERE email = ${body.email || ''} LIMIT 1`;
      if (!user || !(await bcrypt.compare(body.password || '', user.password_hash))) {
        return json(res, 401, { success: false, message: 'Invalid email or password.' });
      }
      setSession(res, user);
      return json(res, 200, { success: true, message: 'Login successful.', data: { user: { id: user.id, name: user.name, email: user.email } } });
    }

    if (path === '/auth/logout.php' && req.method === 'POST') {
      clearSession(res);
      return json(res, 200, { success: true, message: 'Logged out successfully.' });
    }

    const id = userId(req, res);
    if (!id) return;

    if (path === '/auth/me.php' && req.method === 'GET') {
      const [user] = await sql`SELECT id, name, email FROM users WHERE id = ${id} LIMIT 1`;
      return user ? json(res, 200, { success: true, data: { user } }) : json(res, 404, { success: false, message: 'User not found.' });
    }

    if (path === '/dashboard/stats.php' && req.method === 'GET') {
      const [stats] = await sql`
        SELECT
          (SELECT COUNT(*) FROM clients WHERE user_id = ${id}) AS total_clients,
          (SELECT COUNT(*) FROM clients WHERE user_id = ${id} AND status = 'Active') AS active_clients,
          (SELECT COUNT(*) FROM clients WHERE user_id = ${id} AND status = 'Completed') AS completed_clients,
          (SELECT COUNT(*) FROM clients WHERE user_id = ${id} AND status = 'Lead') AS pending_clients,
          (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = ${id}) AS total_tasks,
          (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = ${id} AND t.status != 'Completed' AND t.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days') AS tasks_due_soon,
          (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = ${id} AND t.status != 'Completed' AND t.due_date < CURRENT_DATE) AS overdue_tasks,
          (SELECT COUNT(*) FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = ${id} AND t.status = 'Completed') AS completed_tasks`;
      const statusBreakdown = await sql`SELECT status, COUNT(*) AS total FROM clients WHERE user_id = ${id} GROUP BY status`;
      const recentClients = await sql`SELECT * FROM clients WHERE user_id = ${id} ORDER BY created_at DESC LIMIT 5`;
      const upcomingTasks = await sql`SELECT t.*, c.client_name, c.company_name FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = ${id} AND t.status != 'Completed' ORDER BY t.due_date ASC, t.priority DESC LIMIT 5`;
      const breakdown = { Lead: 0, Active: 0, 'On Hold': 0, Completed: 0 };
      statusBreakdown.forEach((item) => { breakdown[item.status] = Number(item.total); });
      return json(res, 200, { success: true, data: { ...Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, Number(value)])), status_breakdown: breakdown, recent_clients: recentClients, upcoming_tasks: upcomingTasks } });
    }

    if (path === '/clients/' || path === '/clients') return clientsHandler(req, res, id, body);
    if (path === '/tasks/' || path === '/tasks') return tasksHandler(req, res, id, body);
    return json(res, 404, { success: false, message: 'Route not found.' });
  } catch (error) {
    console.error(error);
    return json(res, 500, { success: false, message: 'Unable to process the request right now.' });
  }
}

async function clientsHandler(req, res, id, body) {
  const clientId = Number(new URL(req.url, 'http://localhost').searchParams.get('id')) || null;
  if (req.method === 'GET') {
    const search = params(req).get('search') || '';
    const status = params(req).get('status') || '';
    const clients = clientId
      ? await sql`SELECT * FROM clients WHERE id = ${clientId} AND user_id = ${id} LIMIT 1`
      : await sql`SELECT * FROM clients WHERE user_id = ${id} AND (${search} = '' OR client_name ILIKE ${`%${search}%`} OR company_name ILIKE ${`%${search}%`} OR email ILIKE ${`%${search}%`} OR project_service ILIKE ${`%${search}%`}) AND (${status} = '' OR status = ${status}) ORDER BY created_at DESC`;
    return json(res, 200, { success: true, data: clientId ? clients[0] || null : clients });
  }
  if (req.method === 'PUT' && clientId) {
    const [client] = await sql`UPDATE clients SET client_name = ${body.client_name}, company_name = ${body.company_name}, email = ${body.email}, phone = ${body.phone || null}, project_service = ${body.project_service}, status = ${body.status || 'Lead'}, notes = ${body.notes || ''}, updated_at = CURRENT_TIMESTAMP WHERE id = ${clientId} AND user_id = ${id} RETURNING *`;
    return json(res, 200, { success: true, data: client });
  }
  if (req.method === 'POST') {
    const [client] = await sql`INSERT INTO clients (user_id, client_name, company_name, email, phone, project_service, status, notes) VALUES (${id}, ${body.client_name}, ${body.company_name}, ${body.email}, ${body.phone || null}, ${body.project_service}, ${body.status || 'Lead'}, ${body.notes || ''}) RETURNING *`;
    return json(res, 201, { success: true, data: client });
  }
  if (req.method === 'DELETE' && clientId) {
    await sql`DELETE FROM clients WHERE id = ${clientId} AND user_id = ${id}`;
    return json(res, 200, { success: true });
  }
  return json(res, 405, { success: false, message: 'Method not allowed.' });
}

async function tasksHandler(req, res, id, body) {
  const query = params(req);
  const taskId = Number(query.get('id')) || null;
  const clientId = Number(query.get('client_id')) || null;
  if (req.method === 'GET') {
    const tasks = taskId
      ? await sql`SELECT t.* FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE t.id = ${taskId} AND c.user_id = ${id} LIMIT 1`
      : clientId
        ? await sql`SELECT t.* FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE t.client_id = ${clientId} AND c.user_id = ${id} ORDER BY t.due_date ASC, t.created_at DESC`
        : await sql`SELECT t.*, c.client_name, c.company_name FROM tasks t INNER JOIN clients c ON c.id = t.client_id WHERE c.user_id = ${id} AND (${query.get('search') || ''} = '' OR t.title ILIKE ${`%${query.get('search') || ''}%`} OR t.description ILIKE ${`%${query.get('search') || ''}%`} OR c.client_name ILIKE ${`%${query.get('search') || ''}%`} OR c.company_name ILIKE ${`%${query.get('search') || ''}%`}) AND (${query.get('status') || ''} = '' OR t.status = ${query.get('status') || ''}) AND (${query.get('priority') || ''} = '' OR t.priority = ${query.get('priority') || ''}) ORDER BY t.due_date ASC, t.created_at DESC`;
    return json(res, 200, { success: true, data: taskId ? tasks[0] || null : tasks });
  }
  if (req.method === 'POST') {
    const [task] = await sql`INSERT INTO tasks (client_id, title, description, status, priority, due_date) VALUES (${Number(body.client_id)}, ${body.title}, ${body.description || ''}, ${body.status || 'To Do'}, ${body.priority || 'Medium'}, ${body.due_date || null}) RETURNING *`;
    return json(res, 201, { success: true, data: task });
  }
  if (req.method === 'PUT' && taskId) {
    const [task] = await sql`UPDATE tasks SET title = ${body.title || ''}, description = ${body.description || ''}, status = ${body.status || 'To Do'}, priority = ${body.priority || 'Medium'}, due_date = ${body.due_date || null}, updated_at = CURRENT_TIMESTAMP WHERE id = ${taskId} AND client_id IN (SELECT id FROM clients WHERE user_id = ${id}) RETURNING *`;
    return json(res, 200, { success: true, data: task });
  }
  if (req.method === 'DELETE' && taskId) {
    await sql`DELETE FROM tasks WHERE id = ${taskId} AND client_id IN (SELECT id FROM clients WHERE user_id = ${id})`;
    return json(res, 200, { success: true });
  }
  return json(res, 405, { success: false, message: 'Method not allowed.' });
}

function params(req) {
  return new URL(req.url, 'http://localhost').searchParams;
}
