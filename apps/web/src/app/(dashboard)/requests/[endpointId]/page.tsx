'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { getSocket } from '@/lib/ws';

interface WebhookRequest {
  id: string; method: string;
  headers: Record<string, string>;
  body: unknown; query: Record<string, string>;
  ip: string; size: number; receivedAt: string;
}

const methodColor = (m: string) => ({
  GET: '#10b981', POST: '#3b82f6', PUT: '#f59e0b',
  DELETE: '#ef4444', PATCH: '#8b5cf6'
}[m] ?? '#6b7280');

export default function RequestsPage() {
  const { endpointId } = useParams<{ endpointId: string }>();
  const [requests, setRequests] = useState<WebhookRequest[]>([]);
  const [selected, setSelected] = useState<WebhookRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [replayUrl, setReplayUrl] = useState('');
  const [replaying, setReplaying] = useState(false);
  const [replayStatus, setReplayStatus] = useState('');

  useEffect(() => {
    api.get(`/requests/${endpointId}`).then(res => {
      setRequests(res.data);
      if (res.data.length > 0) setSelected(res.data[0]);
    }).catch(() => {}).finally(() => setLoading(false));

    const socket = getSocket();
    socket.emit('join', { endpointId });
    socket.on('new_request', (req: WebhookRequest) => {
      setRequests(prev => [req, ...prev]);
      setSelected(req);
      setLive(true);
      setTimeout(() => setLive(false), 2000);
    });

    return () => { socket.off('new_request'); };
  }, [endpointId]);

  const replay = async () => {
    if (!selected || !replayUrl) return;
    setReplaying(true);
    try {
      await api.post('/replay', { requestId: selected.id, targetUrl: replayUrl, maxAttempts: 3 });
      setReplayStatus('✓ queued');
    } catch { setReplayStatus('✗ failed'); }
    setReplaying(false);
    setTimeout(() => setReplayStatus(''), 3000);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>requests</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{requests.length} captured</p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: live ? 'var(--accent)' : 'var(--muted)' }}>
          <span className="live-dot w-2 h-2 rounded-full inline-block"
            style={{ background: live ? 'var(--accent)' : 'var(--muted)' }} />
          {live ? 'new request!' : 'live'}
        </div>
      </div>

      <div className="flex gap-4" style={{ height: 'calc(100vh - 180px)' }}>
        <div className="w-64 shrink-0 overflow-y-auto space-y-1.5">
          {loading ? (
            <p className="text-xs animate-pulse" style={{ color: 'var(--muted)' }}>loading...</p>
          ) : requests.length === 0 ? (
            <div className="p-6 text-center rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>waiting for webhooks...</p>
            </div>
          ) : requests.map(req => (
            <button key={req.id} onClick={() => setSelected(req)}
              className="w-full text-left p-3 rounded-lg border transition-all"
              style={{
                background: selected?.id === req.id ? 'var(--accent-dim)' : 'var(--surface)',
                borderColor: selected?.id === req.id ? 'rgba(255,107,53,0.3)' : 'var(--border)',
              }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={{ color: methodColor(req.method) }}>{req.method}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{req.size}b</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {new Date(req.receivedAt).toLocaleTimeString()}
              </p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="flex-1 overflow-y-auto space-y-3">
            <div className="p-4 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-sm" style={{ color: methodColor(selected.method) }}>{selected.method}</span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{selected.ip}</span>
                <span className="text-xs ml-auto" style={{ color: 'var(--muted)' }}>
                  {new Date(selected.receivedAt).toLocaleString()}
                </span>
              </div>
              {selected.body && (
                <div className="mb-3">
                  <p className="text-xs mb-1 font-medium" style={{ color: 'var(--muted)' }}>body</p>
                  <pre className="text-xs p-3 rounded-lg overflow-auto max-h-48"
                    style={{ background: 'var(--bg)', color: 'var(--accent)', border: '1px solid var(--border)' }}>
                    {JSON.stringify(selected.body, null, 2)}
                  </pre>
                </div>
              )}
              <div>
                <p className="text-xs mb-1 font-medium" style={{ color: 'var(--muted)' }}>headers</p>
                <pre className="text-xs p-3 rounded-lg overflow-auto max-h-32"
                  style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                  {JSON.stringify(selected.headers, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted)' }}>replay →</p>
              <div className="flex gap-2">
                <input value={replayUrl} onChange={e => setReplayUrl(e.target.value)}
                  placeholder="https://your-target.com/webhook"
                  className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                <button onClick={replay} disabled={replaying || !replayUrl}
                  className="px-4 py-2 rounded-lg text-xs font-medium"
                  style={{ background: 'var(--accent)', color: '#fff', opacity: replaying ? 0.7 : 1 }}>
                  {replaying ? '...' : 'send'}
                </button>
              </div>
              {replayStatus && (
                <p className="text-xs mt-2"
                  style={{ color: replayStatus.includes('✓') ? '#10b981' : '#ef4444' }}>
                  {replayStatus}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
