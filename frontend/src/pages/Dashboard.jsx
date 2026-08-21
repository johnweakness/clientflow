import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, Users, BriefcaseBusiness } from 'lucide-react';
import { dashboardApi } from '../services/api';
import StatusBadge from '../components/ui/StatusBadge';

const cards = [
  { key: 'total_clients', label: 'Total Clients', icon: Users },
  { key: 'active_clients', label: 'Active Clients', icon: BriefcaseBusiness },
  { key: 'completed_clients', label: 'Completed Clients', icon: CheckCircle2 },
  { key: 'pending_clients', label: 'Pending Clients', icon: CalendarClock },
  { key: 'total_tasks', label: 'Total Tasks', icon: ArrowRight },
  { key: 'tasks_due_soon', label: 'Tasks Due Soon', icon: CalendarClock },
  { key: 'overdue_tasks', label: 'Overdue Tasks', icon: AlertTriangle },
  { key: 'completed_tasks', label: 'Completed Tasks', icon: CheckCircle2 },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.stats();
        setStats(response.data);
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const statusSummary = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.status_breakdown || {});
  }, [stats]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="mb-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">Good morning</p>
          <h2 className="text-4xl font-semibold text-slate-900">Here is your pulse.</h2>
          <p className="mt-2 max-w-xl text-sm text-slate-500">A quick read on your client relationships and the work moving today.</p>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-800">Live workspace</div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, label, icon: Icon }) => (
          <div key={key} className="dashboard-card rounded-2xl border bg-white p-5 shadow-sm transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="accent-number mt-3 text-3xl font-semibold">{stats?.[key] ?? 0}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                <Icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="surface-panel rounded-2xl border bg-white p-5 shadow-sm transition">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent clients</h2>
          </div>

          <div className="space-y-3">
            {(stats?.recent_clients || []).map((client) => (
              <div key={client.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <p className="font-medium text-slate-900">{client.client_name}</p>
                  <p className="text-sm text-slate-500">{client.company_name}</p>
                </div>
                <StatusBadge label={client.status} type={client.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel rounded-2xl border bg-white p-5 shadow-sm transition">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Client status overview</h2>
          <div className="space-y-3">
            {statusSummary.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm text-slate-700">{status}</span>
                </div>
                <strong className="text-slate-900">{count}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-panel rounded-2xl border bg-white p-5 shadow-sm transition">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Upcoming tasks</h2>
        <div className="space-y-3">
          {(stats?.upcoming_tasks || []).map((task) => (
            <div key={task.id} className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center">
              <div>
                <p className="font-medium text-slate-900">{task.title}</p>
                <p className="text-sm text-slate-500">{task.client_name} • {task.company_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge label={task.priority} type={task.priority} />
                <span className="text-sm text-slate-600">{task.due_date || 'No date'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
