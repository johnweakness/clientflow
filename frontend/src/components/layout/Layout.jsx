import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell min-h-screen text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileOpen} onToggle={setMobileOpen} />

        <div className="flex-1">
          <header className="app-header border-b backdrop-blur-sm">
            <div className="flex items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.24em] text-emerald-700">Workspace / 2026</p>
                <h1 className="text-2xl font-semibold text-slate-900">Business dashboard</h1>
              </div>
            </div>
          </header>

          <main className="page-canvas p-4 sm:p-6 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
