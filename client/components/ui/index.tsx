'use client'

// ─── Utility ──────────────────────────────────────────────────────────────────
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin h-4 w-4', className || 'text-emerald-400')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn(
      'bg-gray-900 border border-white/8 rounded-xl',
      hover && 'transition-all hover:border-white/15 hover:bg-gray-800/80',
      className
    )}>
      {children}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  trend?: 'up' | 'down' | 'neutral'
  accent?: string
  icon?: React.ReactNode
}

export function StatCard({ label, value, sub, accent = 'text-white', icon }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-2">
        <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{label}</p>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      <p className={cn('text-2xl font-bold tabular-nums leading-none mb-1', accent)}>{value}</p>
      {sub && <p className="text-xs text-white/30 mt-1.5">{sub}</p>}
    </Card>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">{title}</h2>
      {action}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, desc, action }: { icon?: string; title: string; desc?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <span className="text-4xl mb-4 opacity-50">{icon}</span>
      <p className="text-sm font-semibold text-white/60 mb-1">{title}</p>
      {desc && <p className="text-xs text-white/30 mb-5 max-w-xs leading-relaxed">{desc}</p>}
      {action}
    </div>
  )
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl p-4">
      <span className="text-red-400 text-sm mt-0.5 shrink-0">⚠</span>
      <div className="flex-1">
        <p className="text-sm text-red-400 font-medium">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="text-xs text-red-400/70 hover:text-red-400 mt-1 underline underline-offset-2">
            Try again
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Conflict Alert ───────────────────────────────────────────────────────────
export function ConflictAlert({ message, severity, exams }: { message: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; exams?: string[] }) {
  const styles = {
    HIGH: { bg: 'bg-red-500/8 border-red-500/25', icon: '🔴', text: 'text-red-400' },
    MEDIUM: { bg: 'bg-orange-500/8 border-orange-500/25', icon: '🟠', text: 'text-orange-400' },
    LOW: { bg: 'bg-yellow-500/8 border-yellow-500/25', icon: '🟡', text: 'text-yellow-400' },
  }[severity]

  return (
    <div className={`flex items-start gap-3 border rounded-xl p-4 ${styles.bg}`}>
      <span className="shrink-0 mt-0.5">{styles.icon}</span>
      <div>
        <p className={`text-sm font-semibold ${styles.text}`}>{severity} — Scheduling Conflict</p>
        <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{message}</p>
        {exams && exams.length > 0 && (
          <p className="text-xs text-white/30 mt-1 font-mono">{exams.join(' ↔ ')}</p>
        )}
      </div>
    </div>
  )
}

// ─── Exam Type Badge ──────────────────────────────────────────────────────────
export function ExamTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    FINAL: 'bg-red-500/15 text-red-400 border-red-500/20',
    MIDTERM: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
    QUIZ: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    ASSIGNMENT: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  }
  return (
    <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${map[type] || 'bg-white/8 text-white/50 border-white/10'}`}>
      {type}
    </span>
  )
}

// ─── Skeletons ────────────────────────────────────────────────────────────────
export function CardSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <div className="bg-gray-900 border border-white/8 rounded-xl p-5 space-y-3 animate-pulse">
      <div className="h-3 w-1/3 bg-white/8 rounded-full" />
      <div className="h-7 w-1/2 bg-white/8 rounded-lg" />
      {lines > 1 && <div className="h-2.5 w-2/3 bg-white/5 rounded-full" />}
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/5 animate-pulse">
      <div className="h-3 w-16 bg-white/8 rounded-full" />
      <div className="h-3 flex-1 bg-white/6 rounded-full" />
      <div className="h-5 w-14 bg-white/8 rounded-full" />
      <div className="h-3 w-24 bg-white/6 rounded-full" />
    </div>
  )
}

// ─── Demo Mode Banner ─────────────────────────────────────────────────────────
export function DemoBanner() {
  return (
    <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3">
      <span className="text-amber-400 text-sm">⚡</span>
      <p className="text-xs text-amber-400 font-medium">
        Demo mode — showing sample data. Connect your backend to use live data.
      </p>
    </div>
  )
}
