'use client'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { examsApi } from '@/lib/api'
import type { Exam, Conflict, CreateExamInput } from '@/lib/types'
import { Card, ExamTypeBadge, ConflictAlert, CardSkeleton, EmptyState, ErrorBanner, TableRowSkeleton, DemoBanner } from '@/components/ui'

const EXAM_TYPES = ['FINAL','MIDTERM','QUIZ','ASSIGNMENT']
const SEMESTERS = ['Spring 2025','Fall 2025','Spring 2026']

const DEMO: Exam[] = [
  { id:'1', course_code:'CS401', course_title:'Algorithms', exam_type:'FINAL', start_time:'2025-05-12T09:00:00Z', end_time:'2025-05-12T11:00:00Z', semester:'Spring 2025', location:'Hall A-101', credit_hours:4 },
  { id:'2', course_code:'MATH301', course_title:'Linear Algebra', exam_type:'MIDTERM', start_time:'2025-05-12T10:30:00Z', end_time:'2025-05-12T12:00:00Z', semester:'Spring 2025', location:'Hall B-203', credit_hours:3 },
]

const BLANK: CreateExamInput = { course_code:'', course_title:'', exam_type:'FINAL', start_time:'', end_time:'', semester:'Spring 2025', location:'', credit_hours:3 }

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isDemo, setIsDemo] = useState(false)
  const [form, setForm] = useState<CreateExamInput>(BLANK)
  const [success, setSuccess] = useState('')

  async function load() {
    try {
      const { exams: list } = await examsApi.list()
      setExams(list)
      if (list.length > 1) {
        const { conflicts: c } = await examsApi.detectConflicts(list)
        setConflicts(c)
      } else { setConflicts([]) }
    } catch {
      setExams(DEMO); setIsDemo(true)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.course_code || !form.course_title || !form.start_time || !form.end_time) {
      setError('Please fill in all required fields.'); return
    }
    setSaving(true); setError('')
    try {
      await examsApi.create(form)
      setForm(BLANK); setSuccess('Exam added!'); setTimeout(()=>setSuccess(''),3000)
      await load()
    } catch { setError('Failed to save exam. Running in demo mode.'); setIsDemo(true) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    try { await examsApi.delete(id); await load() }
    catch { setError('Delete failed in demo mode.') }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Exams</h1>
        <p className="text-sm text-white/40 mt-0.5">Schedule and manage your exams</p>
      </div>

      {isDemo && <DemoBanner />}
      {error && <ErrorBanner message={error} onRetry={()=>setError('')} />}
      {conflicts.length > 0 && conflicts.map((c,i) => <ConflictAlert key={i} message={c.message} severity={c.severity} exams={c.exams?.map(e=>e.course_code)} />)}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-5 lg:col-span-1">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Add Exam</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              {label:'Course Code *',key:'course_code',placeholder:'e.g. CS401'},
              {label:'Course Title *',key:'course_title',placeholder:'e.g. Algorithms'},
              {label:'Location',key:'location',placeholder:'e.g. Hall A-101'},
            ].map(f => (
              <div key={f.key}>
                <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1">{f.label}</label>
                <input
                  value={(form as Record<string,unknown>)[f.key] as string}
                  onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                  placeholder={f.placeholder}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            ))}
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1">Type</label>
              <select value={form.exam_type} onChange={e=>setForm(p=>({...p,exam_type:e.target.value}))}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                {EXAM_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1">Semester</label>
              <select value={form.semester} onChange={e=>setForm(p=>({...p,semester:e.target.value}))}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50">
                {SEMESTERS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[{label:'Start *',key:'start_time'},{label:'End *',key:'end_time'}].map(f=>(
                <div key={f.key}>
                  <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1">{f.label}</label>
                  <input type="datetime-local" value={(form as Record<string,unknown>)[f.key] as string}
                    onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"/>
                </div>
              ))}
            </div>
            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider block mb-1">Credit Hours</label>
              <input type="number" min={1} max={6} value={form.credit_hours}
                onChange={e=>setForm(p=>({...p,credit_hours:parseInt(e.target.value)||3}))}
                className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"/>
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg text-sm transition-colors">
              {saving ? 'Saving...' : 'Add Exam'}
            </button>
            {success && <p className="text-xs text-emerald-400 text-center">{success}</p>}
          </form>
        </Card>

        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white/70 mb-3">Scheduled Exams ({exams.length})</h2>
          {loading ? (
            <Card className="divide-y divide-white/5">
              {[1,2,3].map(i=><TableRowSkeleton key={i}/>)}
            </Card>
          ) : exams.length === 0 ? (
            <Card><EmptyState icon="📋" title="No exams scheduled" desc="Use the form to add your first exam." /></Card>
          ) : (
            <Card className="divide-y divide-white/5">
              {exams.map(exam => (
                <div key={exam.id} className="flex items-start gap-3 p-4 hover:bg-white/2 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono text-white/40">{exam.course_code}</span>
                      <ExamTypeBadge type={exam.exam_type}/>
                    </div>
                    <p className="text-sm font-medium text-white/80 truncate">{exam.course_title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{format(new Date(exam.start_time),'MMM d, yyyy')} · {format(new Date(exam.start_time),'h:mm a')}</p>
                    {exam.location && <p className="text-xs text-white/30 mt-0.5">📍 {exam.location}</p>}
                  </div>
                  <button onClick={()=>handleDelete(exam.id)}
                    className="text-xs text-white/20 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10 shrink-0">
                    Delete
                  </button>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
