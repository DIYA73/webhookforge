'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Summary {
  totalRequests: number;
  totalEndpoints: number;
  totalReplays: number;
  replaySuccessRate: number;
  avgResponseTime: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [timeline, setTimeline] = useState([]);
  const [methods, setMethods] = useState<{ method: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/timeline?days=7'),
      api.get('/analytics/methods'),
    ]).then(([s, t, m]) => {
      setSummary(s.data);
      setTimeline(t.data);
      setMethods(m.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="text-xs animate-pulse" style={{ color: 'var(--muted)' }}>loading...</span>
    </div>
  );

  const stats = summary ? [
    { label: 'total requests', value: summary.totalRequests, icon: '⬢' },
    { label: 'endpoints', value: summary.totalEndpoints, icon: '⬡' },
    { label: 'replay success', value: `${summary.replaySuccessRate}%`, icon: '↺' },
    { label: 'avg response', value: `${summary.avgResponseTime}ms`, icon: '⚡' },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>dashboard</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>your webhook analytics at a glance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="p-4 rounded-xl border"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="text-lg mb-1" style={{ color: 'var(--accent)' }}>{icon}</div>
            <div className="text-xl font-bold" style={{ color: 'var(--text)' }}>{value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="text-xs font-medium mb-4" style={{ color: 'var(--muted)' }}>requests — last 7 days</h2>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={timeline}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false}
              tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '8px', fontSize: '11px' }}
              labelStyle={{ color: '#6b7280' }} itemStyle={{ color: '#ff6b35' }} />
            <Area type="monotone" dataKey="count" stroke="#ff6b35" strokeWidth={2} fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {methods.length > 0 && (
        <div className="p-5 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h2 className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>http methods</h2>
          <div className="flex gap-3">
            {methods.map(({ method, count }) => (
              <div key={method} className="px-3 py-2 rounded-lg text-xs"
                style={{ background: 'var(--accent-dim)', border: '1px solid rgba(255,107,53,0.2)', color: 'var(--accent)' }}>
                {method} <span className="font-bold ml-1">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
