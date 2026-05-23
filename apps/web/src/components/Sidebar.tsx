'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';

const nav = [
  { href: '/dashboard', label: 'dashboard', icon: '◈' },
  { href: '/endpoints', label: 'endpoints', icon: '⬡' },
  { href: '/requests', label: 'requests', icon: '⬢' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-52 flex flex-col border-r h-screen sticky top-0"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="px-4 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>🔨 webhookforge</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                background: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--muted)',
                border: active ? '1px solid rgba(255,107,53,0.2)' : '1px solid transparent',
              }}>
              <span>{icon}</span><span>{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-2 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button onClick={() => { clearToken(); router.push('/login'); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
          style={{ color: 'var(--muted)' }}>
          <span>⎋</span><span>sign out</span>
        </button>
      </div>
    </aside>
  );
}
