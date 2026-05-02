'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { href: '/exams', label: 'Exams', icon: '📋' },
  { href: '/study-plans', label: 'Study Plans', icon: '🧠' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/nlp', label: 'NLP Parser', icon: '💬' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const current = NAV.find(n => path.startsWith(n.href))

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 flex flex-col bg-gray-900 border-r border-white/8">
        <div className="px-4 h-14 flex items-center gap-2.5 border-b border-white/8">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold text-black shrink-0">EF</div>
          <div>
            <p className="text-sm font-semibold leading-none">ExamFlow</p>
            <p className="text-[10px] text-white/30 mt-0.5">AI Platform</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon }) => {
            const active = path === href || path.startsWith(href + '/')
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                  active ? 'bg-emerald-500/15 text-emerald-400 font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-[15px]">{icon}</span>
                <span>{label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-3 border-t border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400 font-bold">MG</div>
            <div>
              <p className="text-xs font-medium text-white/60">Demo Mode</p>
              <p className="text-[10px] text-white/30">examflow.app</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/8 bg-gray-900/50 backdrop-blur-sm">
          <h1 className="text-sm font-semibold">{current?.icon} {current?.label || 'ExamFlow AI'}</h1>
          <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            AI Ready
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
