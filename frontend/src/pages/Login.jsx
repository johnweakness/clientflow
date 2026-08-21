import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'demo@clientflow.test', password: 'Demo123!' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-stage relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full border border-emerald-200/20" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full border border-emerald-200/20" />
      <div className="login-panel relative w-full max-w-md rounded-[2rem] border border-white/70 bg-white p-8 sm:p-10">
        <div className="mb-6 text-center">
          <div className="brand-mark mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-700 text-xl font-bold text-white">C</div>
          <h1 className="text-4xl font-semibold text-slate-900">Welcome back.</h1>
          <p className="mt-2 text-sm text-slate-500">Your client work, in one clear view.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="primary-action flex w-full items-center justify-center rounded-xl px-4 py-3 font-medium text-white transition disabled:cursor-not-allowed disabled:bg-emerald-300"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          Demo login: <span className="font-medium">demo@clientflow.test</span> / <span className="font-medium">Demo123!</span>
        </div>
      </div>
    </div>
  );
}
