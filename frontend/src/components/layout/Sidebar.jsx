import { BarChart3, BriefcaseBusiness, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../ui/ConfirmDialog';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clients', label: 'Clients', icon: BriefcaseBusiness },
  { to: '/tasks', label: 'Tasks', icon: BarChart3 },
];

export default function Sidebar({ mobileOpen, onToggle }) {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className="fixed left-4 top-4 z-40 rounded-md border border-slate-200 bg-white p-2 shadow-sm lg:hidden"
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={
          `fixed inset-y-0 left-0 z-30 w-72 border-r border-slate-200 bg-slate-950 text-slate-100 transition-transform duration-200 lg:static lg:translate-x-0 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`
        }
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="brand-mark flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 font-bold text-white">C</div>
              <div>
                <p className="font-serif text-xl font-semibold tracking-tight">ClientFlow</p>
                <p className="text-xs text-emerald-200/70">Operations hub</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => onToggle(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'sidebar-link-active' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-800 p-4">
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog
        open={showLogoutModal}
        title="Log out of ClientFlow?"
        description="You can sign back in whenever you are ready."
        confirmLabel="Yes, log out"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={async () => {
          await logout();
          setShowLogoutModal(false);
        }}
      />
    </>
  );
}
