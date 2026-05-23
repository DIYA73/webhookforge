'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Endpoint {
  id: string; name: string; slug: string;
  url: string; requestCount: number; createdAt: string;
}

export default function EndpointsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    try { const res = await api.get('/endpoints'); setEndpoints(res.data); }
    catch {} setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try { await api.post('/endpoints', { name }); setName(''); await load(); }
    catch {} setCreating(false);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this endpoint?')) return;
    try { await api.delete(`/endpoints/${id}`); setEndpoints(p => p.filter(e => e.id !== id)); }
    catch {}
  };

  const copy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id); setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>endpoints</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>unique webhook URLs for capturing requests</p>
      </div>

      <form onSubmit={create} className="flex gap-2">
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="endpoint name (e.g. stripe-prod)"
          className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }} />
        <button type="submit" disabled={creating}
          className="px-4 py-2 rounded-lg text-xs font-medium"
          style={{ background: 'var(--accent)', color: '#fff', opacity: creating ? 0.7 : 1 }}>
          {creating ? '...' : '+ new'}
        </button>
      </form>

      {loading ? (
        <p className="text-xs animate-pulse" style={{ color: 'var(--muted)' }}>loading...</p>
      ) : endpoints.length === 0 ? (
        <div className="p-8 text-center rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>no endpoints yet — create one above</p>
        </div>
      ) : (
        <div className="space-y-2">
          {endpoints.map(ep => (
            <div key={ep.id} className="p-4 rounded-xl border animate-slide-in"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{ep.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                      {ep.requestCount} reqs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs truncate flex-1" style={{ color: 'var(--muted)' }}>{ep.url}</code>
                    <button onClick={() => copy(ep.url, ep.id)}
                      className="text-xs px-2 py-1 rounded shrink-0"
                      style={{ color: copied === ep.id ? 'var(--accent)' : 'var(--muted)', background: 'var(--bg)' }}>
                      {copied === ep.id ? '✓ copied' : 'copy'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/requests/${ep.id}`}
                    className="text-xs px-3 py-1.5 rounded-lg"
                    style={{ color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid rgba(255,107,53,0.2)' }}>
                    view →
                  </Link>
                  <button onClick={() => remove(ep.id)}
                    className="text-xs px-2 py-1.5 rounded-lg"
                    style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}>
                    del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
