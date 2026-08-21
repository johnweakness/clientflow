import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, Filter } from 'lucide-react';
import { clientApi } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';
import ConfirmDialog from '../components/ui/ConfirmDialog';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [form, setForm] = useState({
    client_name: '',
    company_name: '',
    email: '',
    phone: '',
    project_service: '',
    status: 'Lead',
    notes: '',
  });
  const [validation, setValidation] = useState({});
  const [clientToDelete, setClientToDelete] = useState(null);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const response = await clientApi.list(params);
      setClients(response.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadClients();
    }, 200);

    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const validateForm = () => {
    const nextErrors = {};

    if (!form.client_name.trim()) nextErrors.client_name = 'Client name is required.';
    if (!form.company_name.trim()) nextErrors.company_name = 'Company name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Valid email is required.';
    if (!form.project_service.trim()) nextErrors.project_service = 'Project/service is required.';
    if (!['Lead', 'Active', 'On Hold', 'Completed'].includes(form.status)) nextErrors.status = 'Invalid status.';

    setValidation(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleInput = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setValidation((current) => ({ ...current, [name]: '' }));
  };

  const resetForm = () => {
    setForm({
      client_name: '',
      company_name: '',
      email: '',
      phone: '',
      project_service: '',
      status: 'Lead',
      notes: '',
    });
    setEditingClient(null);
    setValidation({});
  };

  const submitClient = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingClient) {
        await clientApi.update(editingClient.id, form);
      } else {
        await clientApi.create(form);
      }
      setFormOpen(false);
      resetForm();
      await loadClients();
    } catch (err) {
      setError(err.message || 'Unable to save client.');
    }
  };

  const deleteClient = async () => {
    try {
      await clientApi.remove(clientToDelete.id);
      setClientToDelete(null);
      await loadClients();
    } catch (err) {
      setError(err.message || 'Unable to delete client.');
    }
  };

  const openEditDialog = (client) => {
    setEditingClient(client);
    setForm({
      client_name: client.client_name,
      company_name: client.company_name,
      email: client.email,
      phone: client.phone || '',
      project_service: client.project_service,
      status: client.status,
      notes: client.notes || '',
    });
    setFormOpen(true);
  };

  const totalVisible = useMemo(() => clients.length, [clients]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Clients</h2>
          <p className="text-sm text-slate-500">Manage the client pipeline and key account health.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add client
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search clients, company, email, project..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="relative min-w-[180px]">
            <Filter className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">All statuses</option>
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-medium text-slate-700">No clients found</p>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your search or add a new client.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="border-t border-slate-200">
                    <td className="px-4 py-4">
                      <div>
                        <Link to={`/clients/${client.id}`} className="font-medium text-slate-900 hover:text-blue-600">{client.client_name}</Link>
                        <div className="text-slate-500">{client.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-700">{client.company_name}</td>
                    <td className="px-4 py-4 text-slate-700">{client.project_service}</td>
                    <td className="px-4 py-4"><StatusBadge label={client.status} type={client.status} /></td>
                    <td className="px-4 py-4 text-slate-500">{client.updated_at ? new Date(client.updated_at).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openEditDialog(client)} className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100" aria-label={`Edit ${client.client_name}`}>
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => setClientToDelete(client)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100" aria-label={`Delete ${client.client_name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{editingClient ? 'Edit client' : 'Add client'}</h3>
              <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="text-slate-500 hover:text-slate-700">Close</button>
            </div>

            <form className="grid gap-4 md:grid-cols-2" onSubmit={submitClient}>
              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Client name</label>
                <input name="client_name" value={form.client_name} onChange={handleInput} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
                {validation.client_name && <p className="mt-1 text-xs text-red-600">{validation.client_name}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Company name</label>
                <input name="company_name" value={form.company_name} onChange={handleInput} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
                {validation.company_name && <p className="mt-1 text-xs text-red-600">{validation.company_name}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleInput} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
                {validation.email && <p className="mt-1 text-xs text-red-600">{validation.email}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <input name="phone" value={form.phone} onChange={handleInput} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              </div>

              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Project/service</label>
                <input name="project_service" value={form.project_service} onChange={handleInput} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
                {validation.project_service && <p className="mt-1 text-xs text-red-600">{validation.project_service}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
                <select name="status" value={form.status} onChange={handleInput} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
                  <option value="Lead">Lead</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleInput} rows="4" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">Cancel</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">{editingClient ? 'Save changes' : 'Create client'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(clientToDelete)}
        title="Delete this client?"
        description="This will also remove all tasks related to this client. This action cannot be undone."
        confirmLabel="Yes, delete client"
        onCancel={() => setClientToDelete(null)}
        onConfirm={deleteClient}
      />

      <div className="text-sm text-slate-500">Showing {totalVisible} client(s)</div>
    </div>
  );
}
