'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', workspaceName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      setToken(res.data.accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>🔨 webhookforge</span>
          <p className="text-sm mt-2" style={{ color: 'var(--muted)' }}>create your workspace</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-xl border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          {error && (
            <div className="text-xs px-3 py-2 rounded"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}
          {[
            { key: 'name', label: 'your name', type: 'text' },
            { key: 'email', label: 'email', type: 'email' },
            { key: 'password', label: 'password', type: 'password' },
            { key: 'workspaceName', label: 'workspace name', type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-xs mb-1 block" style={{ color: 'var(--muted)' }}>{label}</label>
              <input type={type} value={form[key as keyof typeof form]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                required />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full py-2 rounded-lg text-sm font-medium"
            style={{ background: 'var(--accent)', color: '#fff', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'creating...' : 'create workspace →'}
          </button>
        </form>
        <p className="text-center text-xs mt-4" style={{ color: 'var(--muted)' }}>
          have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)' }}>sign in</Link>
        </p>
      </div>
    </div>
  );
}
