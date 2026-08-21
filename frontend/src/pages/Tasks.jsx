import { useEffect, useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { clientApi, taskApi } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [clients, setClients] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ client_id: '', title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const response = await taskApi.list(params);
      setTasks(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTasks();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await clientApi.list();
        setClients(response.data || []);
      } catch (err) {
        setError(err.message || 'Unable to load clients.');
      }
    };

    loadClients();
  }, []);

  const handleTaskSubmit = async (event) => {
    event.preventDefault();

    if (!taskForm.client_id || !taskForm.title.trim()) {
      setError('Choose a client and enter a task title.');
      return;
    }

    try {
      await taskApi.create({ ...taskForm, client_id: Number(taskForm.client_id) });
      setTaskForm({ client_id: '', title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });
      setShowTaskModal(false);
      setError('');
      await loadTasks();
    } catch (err) {
      setError(err.message || 'Unable to create task.');
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await taskApi.update(taskId, { status: newStatus });
      await loadTasks();
    } catch (err) {
      setError(err.message || 'Unable to update task status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Work queue</p>
          <h2 className="text-3xl font-semibold text-slate-900">Tasks</h2>
          <p className="mt-1 text-sm text-slate-500">Track work across all active client engagements.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowTaskModal(true)}
          className="primary-action inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus size={17} />
          Add task
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search task or client"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="">All statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            <option value="">All priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Due date</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-10 text-center text-slate-500">No tasks match your filters.</td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.id} className="border-t border-slate-200">
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">{task.title}</div>
                        <div className="text-slate-500">{task.description || 'No description'}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-700">{task.client_name}</td>
                      <td className="px-4 py-4 text-slate-600">{task.due_date || 'No due date'}</td>
                      <td className="px-4 py-4"><StatusBadge label={task.priority} type={task.priority} /></td>
                      <td className="px-4 py-4">
                        <select value={task.status} onChange={(event) => updateTaskStatus(task.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm">
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">New work item</p>
                <h2 id="add-task-title" className="text-2xl font-semibold text-slate-900">Add task</h2>
              </div>
              <button type="button" onClick={() => setShowTaskModal(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close add task dialog">
                <X size={19} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleTaskSubmit}>
              <label className="text-sm font-medium text-slate-700">
                Client
                <select required value={taskForm.client_id} onChange={(event) => setTaskForm((current) => ({ ...current, client_id: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none">
                  <option value="">Choose a client</option>
                  {clients.map((client) => <option key={client.id} value={client.id}>{client.client_name} · {client.company_name}</option>)}
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Task title
                <input required value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} placeholder="e.g. Prepare kickoff notes" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none" />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Description
                <textarea value={taskForm.description} onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))} rows="3" placeholder="Add useful context for this task" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none" />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="text-sm font-medium text-slate-700">Status<select value={taskForm.status} onChange={(event) => setTaskForm((current) => ({ ...current, status: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none"><option>To Do</option><option>In Progress</option><option>Completed</option></select></label>
                <label className="text-sm font-medium text-slate-700">Priority<select value={taskForm.priority} onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none"><option>Low</option><option>Medium</option><option>High</option></select></label>
                <label className="text-sm font-medium text-slate-700">Due date<input type="date" value={taskForm.due_date} onChange={(event) => setTaskForm((current) => ({ ...current, due_date: event.target.value }))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none" /></label>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setShowTaskModal(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="primary-action rounded-xl px-4 py-2.5 text-sm font-semibold text-white">Create task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
