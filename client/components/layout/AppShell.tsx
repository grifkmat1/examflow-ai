'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', emoji: '⊞' },
  { href: '/exams', label: 'Exams', emoji: '📋' },
  { href: '/study-plans', label: 'Study Plans', emoji: '🧠' },
  { href: '/analytics', label: 'Analytics', emoji: '📊' },
  { href: '/nlp', label: 'NLP Parser', emoji: '💬' },
]

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col bg-white border-r border-surface-200">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-surface-100">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">EF</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900 leading-none">ExamFlow</p>
            <p className="text-[10px] text-surface-400 leading-none mt-0.5">AI Scheduler</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-surface-400 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
          {NAV_ITEMS.map(({ href, label, emoji }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={active ? 'nav-link-active' : 'nav-link'}
              >
                <span className="text-base leading-none">{emoji}</span>
                <span>{label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-surface-100">
          <div className="flex items-center gap-2.5">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-surface-700 truncate">My Account</p>
              <p className="text-[10px] text-surface-400">Manage profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white border-b border-surface-200">
          <h1 className="text-sm font-semibold text-surface-900">
            {NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label || 'ExamFlow AI'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-surface-500 bg-surface-100 rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-slow" />
              AI Ready
            </span>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
