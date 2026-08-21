import { LogOut, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Yes, continue', onConfirm, onCancel }) {
  if (!open) return null;

  const isDestructive = confirmLabel.toLowerCase().includes('delete') || confirmLabel.toLowerCase().includes('log out');
  const Icon = isDestructive && !confirmLabel.toLowerCase().includes('log out') ? Trash2 : LogOut;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
      <div className="w-full max-w-sm rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={22} />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="confirm-dialog-title" className="text-2xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close confirmation dialog">
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            No, cancel
          </button>
          <button type="button" onClick={onConfirm} className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
