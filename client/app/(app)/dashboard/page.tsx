'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { examsApi, healthApi } from '@/lib/api'
import type { Exam, Conflict } from '@/lib/types'
import { StatCard, Card, ConflictAlert, ExamTypeBadge, CardSkeleton, EmptyState, DemoBanner } from '@/components/ui'

const DEMO: Exam[] = [
  { id:'1', course_code:'CS401', course_title:'Algorithms & Data Structures', exam_type:'FINAL', start_time:'2025-05-12T09:00:00Z', end_time:'2025-05-12T11:00:00Z', semester:'Spring 2025', location:'Hall A-101', credit_hours:4 },
  { id:'2', course_code:'MATH301', course_title:'Linear Algebra', exam_type:'MIDTERM', start_time:'2025-05-12T10:30:00Z', end_time:'2025-05-12T12:00:00Z', semester:'Spring 2025', location:'Hall B-203', credit_hours:3 },
  { id:'3', course_code:'PHYS201', course_title:'Classical Mechanics', exam_type:'FINAL', start_time:'2025-05-14T14:00:00Z', end_time:'2025-05-14T16:00:00Z', semester:'Spring 2025', location:'Lab C', credit_hours:4 },
]
const DEMO_CONFLICTS: Conflict[] = [
  { type:'OVERLAP', severity:'HIGH', message:'CS401 and MATH301 overlap by 30 minutes on May 12th.', exams:[DEMO[0],DEMO[1]] }
]
const QUICK = [
  { href:'/exams', icon:'📋', label:'Add Exam', desc:'Schedule a new exam' },
  { href:'/study-plans', icon:'🧠', label:'Study Plan', desc:'Generate with Claude AI' },
  { href:'/analytics', icon:'📊', label:'Analytics', desc:'Workload breakdown' },
  { href:'/nlp', icon:'💬', label:'NLP Parser', desc:'Natural language input' },
]

export default function DashboardPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking'|'online'|'offline'>('checking')

  useEffect(() => {
    async function load() {
      try { await healthApi.check(); setApiStatus('online') } catch { setApiStatus('offline') }
      try {
        const { exams: list } = await examsApi.list()
        setExams(list)
        if (list.length > 1) {
          const { conflicts: c } = await examsApi.detectConflicts(list)
          setConflicts(c)
        }
      } catch {
        setExams(DEMO); setConflicts(DEMO_CONFLICTS); setIsDemo(true)
      } finally { setLoading(false) }
    }
    load()
  }, [])

  const totalCredits = exams.reduce((s, e) => s + (e.credit_hours || 0), 0)
  const finals = exams.filter(e => e.exam_type === 'FINAL').length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-0.5">Your semester overview</p>
        </div>
        <div className="flex items-center gap-2">
          {isDemo && <span className="text-[10px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">Demo data</span>}
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${apiStatus==='online'?'bg-emerald-500/15 text-emerald-400 border-emerald-500/20':apiStatus==='offline'?'bg-red-500/10 text-red-400 border-red-500/20':'bg-white/5 text-white/30 border-white/10'}`}>
            {apiStatus==='online'?'● API connected':apiStatus==='offline'?'○ API offline':'◌ Checking...'}
          </span>
        </div>
      </div>

      {isDemo && <DemoBanner />}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i=><CardSkeleton key={i}/>)}</div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Exams" value={exams.length} sub="this semester" icon="📋" />
          <StatCard label="Conflicts" value={conflicts.length} sub="detected" accent={conflicts.length>0?'text-red-400':'text-emerald-400'} icon="⚠️" />
          <StatCard label="Credit Hours" value={totalCredits} sub="total load" accent="text-blue-400" icon="📚" />
          <StatCard label="Finals" value={finals} sub="high-stakes exams" accent="text-orange-400" icon="🎓" />
        </div>
      )}

      {!loading && conflicts.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Active Conflicts</p>
          {conflicts.map((c,i) => <ConflictAlert key={i} message={c.message} severity={c.severity} exams={c.exams?.map(e=>e.course_code)} />)}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Upcoming Exams</p>
          <Link href="/exams" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium">View all →</Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{[1,2,3].map(i=><CardSkeleton key={i}/>)}</div>
        ) : exams.length === 0 ? (
          <Card className="border-dashed">
            <EmptyState icon="📅" title="No exams yet" desc="Add your first exam to get started." action={<Link href="/exams" className="text-xs bg-emerald-500 text-black font-semibold px-4 py-1.5 rounded-lg">Add exam</Link>} />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {exams.slice(0,6).map(exam => (
              <Card key={exam.id} hover className="p-4 group">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-mono text-white/35">{exam.course_code}</span>
                  <ExamTypeBadge type={exam.exam_type} />
                </div>
                <h3 className="text-sm font-semibold text-white/85 mb-2 line-clamp-1 group-hover:text-white transition-colors">{exam.course_title}</h3>
                <p className="text-xs text-white/40">{format(new Date(exam.start_time),'MMM d, yyyy')} · {format(new Date(exam.start_time),'h:mm a')}</p>
                {exam.location && <p className="text-xs text-white/30 mt-0.5">📍 {exam.location}</p>}
                {exam.credit_hours && <p className="text-xs text-white/30 mt-0.5">{exam.credit_hours} credit hrs</p>}
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK.map(a => (
            <Link key={a.href} href={a.href} className="group p-4 bg-gray-900 border border-white/8 rounded-xl hover:border-white/15 hover:bg-gray-800/80 transition-all">
              <span className="text-2xl mb-2 block">{a.icon}</span>
              <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{a.label}</p>
              <p className="text-xs text-white/35 mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
