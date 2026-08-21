const styles = {
  Lead: 'bg-slate-100 text-slate-700 ring-slate-200',
  Active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  'On Hold': 'bg-amber-100 text-amber-700 ring-amber-200',
  Completed: 'bg-blue-100 text-blue-700 ring-blue-200',
  'To Do': 'bg-slate-100 text-slate-700 ring-slate-200',
  'In Progress': 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
  Medium: 'bg-amber-100 text-amber-700 ring-amber-200',
  High: 'bg-rose-100 text-rose-700 ring-rose-200',
};

export default function StatusBadge({ label, type = 'Lead' }) {
  const className = styles[type] || styles.Lead;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
      {label || type}
    </span>
  );
}
