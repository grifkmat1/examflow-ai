'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { examsApi, healthApi } from '@/lib/api'
import type { Exam, Conflict } from '@/lib/types'
import { StatCard, Card, ConflictAlert, ExamTypeBadge, CardSkeleton, ErrorBanner, EmptyState } from '@/components/ui'
import type { Metadata } from 'next'

const DEMO_EXAMS: Exam[] = [
  { id: '1', course_code: 'CS401', course_title: 'Algorithms & Data Structures', exam_type: 'FINAL', start_time: '2025-05-12T09:00:00Z', end_time: '2025-05-12T11:00:00Z', semester: 'Spring 2025', location: 'Hall A-101', credit_hours: 4 },
  { id: '2', course_code: 'MATH301', course_title: 'Linear Algebra', exam_type: 'MIDTERM', start_time: '2025-05-12T10:30:00Z', end_time: '2025-05-12T12:00:00Z', semester: 'Spring 2025', location: 'Hall B-203', credit_hours: 3 },
  { id: '3', course_code: 'PHYS201', course_title: 'Classical Mechanics', exam_type: 'FINAL', start_time: '2025-05-14T14:00:00Z', end_time: '2025-05-14T16:00:00Z', semester: 'Spring 2025', location: 'Lab C', credit_hours: 4 },
]

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const health = await healthApi.check()
        setApiStatus('online')
      } catch {
        setApiStatus('offline')
      }

      try {
        const { exams: list } = await examsApi.list()
        setExams(list)
        if (list.length > 1) {
          const { conflicts: c } = await examsApi.detectConflicts(list)
          setConflicts(c)
        }
      } catch {
        setExams(DEMO_EXAMS)
        setIsDemo(true)
        try {
          const { conflicts: c } = await examsApi.detectConflicts(DEMO_EXAMS)
          setConflicts(c)
        } catch {}
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalCredits = exams.reduce((sum, e) => sum + (e.credit_hours || 0), 0)
  const upcoming = exams.slice(0, 6)

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-sm text-surface-500 mt-0.5">Your exam schedule overview</p>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && (
            <span className="badge badge-orange">Demo Data</span>
          )}
          <span className={`badge ${apiStatus === 'online' ? 'badge-green' : apiStatus === 'offline' ? 'badge-red' : 'badge-gray'}`}>
            {apiStatus === 'online' ? '● API Live' : apiStatus === 'offline' ? '○ API Offline' : '◌ Checking...'}
          </span>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Exams" value={exams.length} sub="this semester" color="gray" icon={<span>📋</span>} />
          <StatCard label="Conflicts" value={conflicts.length} sub="detected" color={conflicts.length > 0 ? 'red' : 'green'} icon={<span>⚠️</span>} />
          <StatCard label="Credit Hours" value={totalCredits} sub="total load" color="blue" icon={<span>📚</span>} />
          <StatCard label="Finals" value={exams.filter(e => e.exam_type === 'FINAL').length} sub="exams" color="orange" icon={<span>🎓</span>} />
        </div>
      )}

      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-surface-700">⚠ Schedule Conflicts</h2>
          {conflicts.map((c, i) => (
            <ConflictAlert key={i} message={c.message} severity={c.severity} exams={c.exams?.map(e => e.course_code)} />
          ))}
        </div>
      )}

      {/* Upcoming Exams */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-surface-700">Upcoming Exams</h2>
          <Link href="/exams" className="text-xs text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : upcoming.length === 0 ? (
          <Card>
            <EmptyState
              title="No exams scheduled"
              description="Add your first exam to get started"
              icon="📅"
              action={<Link href="/exams" className="btn-primary text-xs">Add Exam</Link>}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(exam => (
              <Card key={exam.id} hover className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono text-surface-400">{exam.course_code}</span>
                  <ExamTypeBadge type={exam.exam_type} />
                </div>
                <h3 className="text-sm font-semibold text-surface-900 mb-2 line-clamp-1">{exam.course_title}</h3>
                <p className="text-xs text-surface-500">{format(new Date(exam.start_time), 'MMM d, yyyy · h:mm a')}</p>
                {exam.location && <p className="text-xs text-surface-400 mt-0.5">📍 {exam.location}</p>}
                {exam.credit_hours && <p className="text-xs text-surface-400 mt-0.5">{exam.credit_hours} credit hrs</p>}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-surface-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/exams', label: 'Add Exam', icon: '➕', desc: 'Schedule a new exam' },
            { href: '/study-plans', label: 'Study Plan', icon: '🧠', desc: 'Generate AI plan' },
            { href: '/analytics', label: 'Analytics', icon: '📊', desc: 'View workload' },
            { href: '/nlp', label: 'NLP Parser', icon: '💬', desc: 'Natural language input' },
          ].map(a => (
            <Link key={a.href} href={a.href} className="card p-4 hover:shadow-md transition-shadow group">
              <span className="text-2xl mb-2 block">{a.icon}</span>
              <p className="text-sm font-semibold text-surface-900 group-hover:text-brand-700">{a.label}</p>
              <p className="text-xs text-surface-400 mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
