const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost/clientflow/backend/public';

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
  const options = {
    method,
    credentials: 'include',
    headers: {
      ...headers,
    },
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }

  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(`Cannot connect to the API. Check VITE_API_BASE_URL: ${API_BASE}`);
  }
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong.');
  }

  return payload;
}

export const authApi = {
  login: (email, password) => request('/api/auth/login.php', { method: 'POST', body: { email, password } }),
  logout: () => request('/api/auth/logout.php', { method: 'POST' }),
  me: () => request('/api/auth/me.php'),
};

export const clientApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/clients/?${query ? `&${query}` : ''}`.replace('/api/clients/?&', '/api/clients/?'));
  },
  get: (id) => request(`/api/clients/?id=${id}`),
  create: (payload) => request('/api/clients/', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/clients/?id=${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/clients/?id=${id}`, { method: 'DELETE' }),
};

export const taskApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/tasks/?${query ? `&${query}` : ''}`.replace('/api/tasks/?&', '/api/tasks/?'));
  },
  get: (id) => request(`/api/tasks/?id=${id}`),
  getByClient: (clientId) => request(`/api/tasks/?client_id=${clientId}`),
  create: (payload) => request('/api/tasks/', { method: 'POST', body: payload }),
  update: (id, payload) => request(`/api/tasks/?id=${id}`, { method: 'PUT', body: payload }),
  remove: (id) => request(`/api/tasks/?id=${id}`, { method: 'DELETE' }),
};

export const dashboardApi = {
  stats: () => request('/api/dashboard/stats.php'),
};

export default { authApi, clientApi, taskApi, dashboardApi };
