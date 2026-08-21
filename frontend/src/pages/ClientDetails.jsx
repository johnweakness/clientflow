import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { clientApi, taskApi } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });
  const [taskError, setTaskError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientResponse, taskResponse] = await Promise.all([
        clientApi.get(id),
        taskApi.getByClient(id),
      ]);
      setClient(clientResponse.data || null);
      setTasks(taskResponse.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load this client.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDeleteClient = async () => {
    try {
      await clientApi.remove(id);
      setConfirmAction(null);
      navigate('/clients');
    } catch (err) {
      setError(err.message || 'Unable to delete client.');
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();

    if (!taskForm.title.trim()) {
      setTaskError('Task title is required.');
      return;
    }

    try {
      await taskApi.create({ ...taskForm, client_id: Number(id) });
      setTaskForm({ title: '', description: '', status: 'To Do', priority: 'Medium', due_date: '' });
      setShowTaskForm(false);
      setTaskError('');
      await loadData();
    } catch (err) {
      setTaskError(err.message || 'Unable to add task.');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await taskApi.update(taskId, { status });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to update task status.');
    }
  };

  const deleteTask = async () => {
    try {
      await taskApi.remove(confirmAction.id);
      setConfirmAction(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to delete task.');
    }
  };

  if (loading) {
    return <div className="rounded-2xl bg-slate-200 p-8 animate-pulse" />;
  }

  if (error || !client) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">{error || 'Client not found.'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/clients" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
          <ArrowLeft size={16} />
          Back to clients
        </Link>

        <div className="flex gap-2">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700">
            <Pencil size={16} />
            Edit Client
          </button>
          <button type="button" onClick={() => setShowTaskForm((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
            <Plus size={16} />
            Add Task
          </button>
          <button type="button" onClick={() => setConfirmAction({ type: 'client' })} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            <Trash2 size={16} />
            Delete Client
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Client profile</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">{client.client_name}</h2>
            <p className="mt-1 text-slate-600">{client.company_name}</p>
          </div>
          <StatusBadge label={client.status} type={client.status} />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li><span className="font-medium">Email:</span> {client.email}</li>
              <li><span className="font-medium">Phone:</span> {client.phone || '—'}</li>
              <li><span className="font-medium">Project:</span> {client.project_service}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Overview</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li><span className="font-medium">Created:</span> {new Date(client.created_at).toLocaleDateString()}</li>
              <li><span className="font-medium">Updated:</span> {new Date(client.updated_at).toLocaleDateString()}</li>
              <li><span className="font-medium">Notes:</span> {client.notes || 'No notes available.'}</li>
            </ul>
          </div>
        </div>
      </div>

      {showTaskForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Add task</h3>
          <form onSubmit={handleTaskSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Task title</label>
              <input value={taskForm.title} onChange={(event) => setTaskForm((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea value={taskForm.description} onChange={(event) => setTaskForm((current) => ({ ...current, description: event.target.value }))} rows="3" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select value={taskForm.status} onChange={(event) => setTaskForm((current) => ({ ...current, status: event.target.value }))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Priority</label>
              <select value={taskForm.priority} onChange={(event) => setTaskForm((current) => ({ ...current, priority: event.target.value }))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Due date</label>
              <input type="date" value={taskForm.due_date} onChange={(event) => setTaskForm((current) => ({ ...current, due_date: event.target.value }))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
            </div>

            {taskError && <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{taskError}</div>}

            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowTaskForm(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button>
              <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Create task</button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Client tasks</h3>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No tasks assigned yet.</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="text-sm text-slate-500">{task.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex gap-2">
                    <StatusBadge label={task.priority} type={task.priority} />
                    <StatusBadge label={task.status} type={task.status} />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span>Due: {task.due_date || 'No date'}</span>
                  <select value={task.status} onChange={(event) => updateTaskStatus(task.id, event.target.value)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button type="button" onClick={() => setConfirmAction({ type: 'task', id: task.id })} className="rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-red-600">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={confirmAction?.type === 'client' ? 'Delete this client?' : 'Delete this task?'}
        description={confirmAction?.type === 'client' ? 'This will also remove all tasks related to this client. This action cannot be undone.' : 'This task will be permanently removed from the client workspace.'}
        confirmLabel={confirmAction?.type === 'client' ? 'Yes, delete client' : 'Yes, delete task'}
        onCancel={() => setConfirmAction(null)}
        onConfirm={confirmAction?.type === 'client' ? handleDeleteClient : deleteTask}
      />
    </div>
  );
}
