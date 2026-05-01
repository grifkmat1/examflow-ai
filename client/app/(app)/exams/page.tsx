'use client'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { examsApi } from '@/lib/api'
import type { Exam, CreateExamInput, ExamType, Conflict } from '@/lib/types'
import { Card, ExamTypeBadge, ConflictAlert, ErrorBanner, EmptyState, Spinner, TableSkeleton } from '@/components/ui'

const EMPTY_FORM: CreateExamInput = {
  course_code: '',
  course_title: '',
  exam_type: 'FINAL',
  start_time: '',
  end_time: '',
  semester: 'Spring 2025',
  location: '',
  credit_hours: undefined,
}

const DEMO: Exam[] = [
  { id: '1', course_code: 'CS401', course_title: 'Algorithms & Data Structures', exam_type: 'FINAL', start_time: '2025-05-12T09:00:00Z', end_time: '2025-05-12T11:00:00Z', semester: 'Spring 2025', location: 'Hall A-101', credit_hours: 4 },
  { id: '2', course_code: 'MATH301', course_title: 'Linear Algebra', exam_type: 'MIDTERM', start_time: '2025-05-12T10:30:00Z', end_time: '2025-05-12T12:00:00Z', semester: 'Spring 2025', location: 'Hall B-203', credit_hours: 3 },
  { id: '3', course_code: 'PHYS201', course_title: 'Classical Mechanics', exam_type: 'FINAL', start_time: '2025-05-14T14:00:00Z', end_time: '2025-05-14T16:00:00Z', semester: 'Spring 2025', location: 'Lab Complex', credit_hours: 4 },
  { id: '4', course_code: 'CS350', course_title: 'Operating Systems', exam_type: 'QUIZ', start_time: '2025-05-15T13:00:00Z', end_time: '2025-05-15T13:45:00Z', semester: 'Spring 2025', location: 'Hall A-210', credit_hours: 3 },
]

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [form, setForm] = useState<CreateExamInput>(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => { loadExams() }, [])

  async function loadExams() {
    setLoading(true)
    try {
      const { exams: list } = await examsApi.list()
      setExams(list)
      if (list.length > 1) {
        const { conflicts: c } = await examsApi.detectConflicts(list)
        setConflicts(c)
      }
    } catch {
      setExams(DEMO)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    try {
      await examsApi.create({
        ...form,
        start_time: new Date(form.start_time).toISOString(),
        end_time: new Date(form.end_time).toISOString(),
      })
      setForm(EMPTY_FORM)
      await loadExams()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create exam')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this exam?')) return
    setDeletingId(id)
    try {
      await examsApi.delete(id)
      setExams(prev => prev.filter(e => e.id !== id))
    } catch {
      setExams(prev => prev.filter(e => e.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const upd = (k: keyof CreateExamInput, v: string | number) =>
    setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Exams</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {exams.length} exam{exams.length !== 1 ? 's' : ''} scheduled
            {isDemo && <span className="ml-2 badge badge-orange">Demo</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Add Exam Form */}
        <Card className="lg:col-span-2 self-start">
          <h2 className="text-sm font-semibold text-surface-900 mb-4">Add New Exam</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Course Code</label>
                <input className="input" placeholder="CS401" value={form.course_code}
                  onChange={e => upd('course_code', e.target.value)} required />
              </div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.exam_type}
                  onChange={e => upd('exam_type', e.target.value as ExamType)}>
                  <option>FINAL</option>
                  <option>MIDTERM</option>
                  <option>QUIZ</option>
                  <option>ASSIGNMENT</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Course Title</label>
              <input className="input" placeholder="Algorithms & Data Structures" value={form.course_title}
                onChange={e => upd('course_title', e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Start Time</label>
                <input type="datetime-local" className="input" value={form.start_time}
                  onChange={e => upd('start_time', e.target.value)} required />
              </div>
              <div>
                <label className="label">End Time</label>
                <input type="datetime-local" className="input" value={form.end_time}
                  onChange={e => upd('end_time', e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Semester</label>
                <input className="input" value={form.semester}
                  onChange={e => upd('semester', e.target.value)} required />
              </div>
              <div>
                <label className="label">Credit Hours</label>
                <input type="number" className="input" placeholder="3" min="0" max="12"
                  value={form.credit_hours || ''}
                  onChange={e => upd('credit_hours', Number(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Hall A-101 (optional)" value={form.location || ''}
                onChange={e => upd('location', e.target.value)} />
            </div>
            {submitError && <ErrorBanner message={submitError} />}
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <><Spinner /> Adding...</> : '+ Add Exam'}
            </button>
          </form>
        </Card>

        {/* Exams List */}
        <div className="lg:col-span-3 space-y-4">
          {conflicts.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Conflicts</h2>
              {conflicts.map((c, i) => (
                <ConflictAlert key={i} message={c.message} severity={c.severity}
                  exams={c.exams?.map(e => e.course_code)} />
              ))}
            </div>
          )}

          {loading ? (
            <TableSkeleton rows={4} />
          ) : exams.length === 0 ? (
            <Card><EmptyState title="No exams yet" description="Add your first exam using the form" icon="📅" /></Card>
          ) : (
            <div className="space-y-2">
              {exams.map(exam => {
                const start = new Date(exam.start_time)
                const end = new Date(exam.end_time)
                const dur = Math.round((end.getTime() - start.getTime()) / 60000)
                return (
                  <Card key={exam.id} hover className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-surface-400 shrink-0">{exam.course_code}</span>
                          <ExamTypeBadge type={exam.exam_type} />
                          {exam.credit_hours && (
                            <span className="text-xs text-surface-400 ml-auto shrink-0">{exam.credit_hours} cr</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-surface-900 truncate">{exam.course_title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-xs text-surface-500">
                            {format(start, 'MMM d')} · {format(start, 'h:mm a')}–{format(end, 'h:mm a')}
                            <span className="text-surface-300 ml-1">({dur}m)</span>
                          </p>
                          {exam.location && (
                            <p className="text-xs text-surface-400">📍 {exam.location}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        disabled={deletingId === exam.id}
                        className="btn-danger shrink-0"
                      >
                        {deletingId === exam.id ? <Spinner className="h-3 w-3" /> : '✕'}
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
