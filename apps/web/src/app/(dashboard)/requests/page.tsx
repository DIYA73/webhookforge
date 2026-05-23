'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RequestsIndexPage() {
  const [endpoints, setEndpoints] = useState<any[]>([]);
  useEffect(() => { api.get('/endpoints').then(r => setEndpoints(r.data)).catch(() => {}); }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>requests</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>select an endpoint to inspect its requests</p>
      </div>
      <div className="space-y-2">
        {endpoints.map(ep => (
          <Link key={ep.id} href={`/requests/${ep.id}`}
            className="flex items-center justify-between p-4 rounded-xl border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)', display: 'flex' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{ep.name}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{ep.slug}</p>
            </div>
            <span className="text-xs" style={{ color: 'var(--accent)' }}>{ep.requestCount} reqs →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
