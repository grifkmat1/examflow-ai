'use client'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs))
}

// ─── Spinner ─────────────────────────────────────────────────────────────────

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-4 w-4 text-brand-600', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div className={cn('card p-6', hover && 'transition-shadow hover:shadow-md', className)}>
      {children}
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  color?: 'green' | 'blue' | 'orange' | 'red' | 'gray'
  icon?: React.ReactNode
}

export function StatCard({ label, value, sub, color = 'gray', icon }: StatCardProps) {
  const colorClasses = {
    green: 'text-brand-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    gray: 'text-surface-900',
  }

  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-1">{label}</p>
        <p className={cn('text-3xl font-bold tabular-nums', colorClasses[color])}>{value}</p>
        {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
      </div>
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-surface-100 flex items-center justify-center text-surface-500">
          {icon}
        </div>
      )}
    </Card>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: string
}

export function EmptyState({ title, description, action, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-4">{icon}</span>
      <h3 className="text-sm font-semibold text-surface-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-surface-500 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

// ─── Error Banner ────────────────────────────────────────────────────────────

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4">
      <p className="text-sm text-red-700 font-medium">⚠ {message}</p>
    </div>
  )
}

// ─── Conflict Alert ──────────────────────────────────────────────────────────

interface ConflictAlertProps {
  message: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  exams?: string[]
}

export function ConflictAlert({ message, severity, exams }: ConflictAlertProps) {
  const colors = {
    HIGH: 'bg-red-50 border-red-200 text-red-800',
    MEDIUM: 'bg-orange-50 border-orange-200 text-orange-800',
    LOW: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }
  const icons = { HIGH: '🔴', MEDIUM: '🟠', LOW: '🟡' }

  return (
    <div className={`rounded-lg border p-3 ${colors[severity]}`}>
      <div className="flex items-start gap-2">
        <span>{icons[severity]}</span>
        <div>
          <p className="text-sm font-medium">{message}</p>
          {exams && <p className="text-xs mt-0.5 opacity-75">{exams.join(' · ')}</p>}
        </div>
      </div>
    </div>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────

export function ExamTypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    FINAL: 'badge-red',
    MIDTERM: 'badge-orange',
    QUIZ: 'badge-blue',
    ASSIGNMENT: 'badge-green',
  }
  return <span className={styles[type] || 'badge-gray'}>{type}</span>
}

// ─── Loading Skeleton ────────────────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <div className="card p-6 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="skeleton h-8 w-1/2 rounded" />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}

export { cn }
