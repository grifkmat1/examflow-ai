'use client'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts'
import { examsApi } from '@/lib/api'
import type { Exam } from '@/lib/types'
import { StatCard, Card, ExamTypeBadge, CardSkeleton } from '@/components/ui'
import { format } from 'date-fns'

const DEMO: Exam[] = [
  { id:'1', course_code:'CS401', course_title:'Algorithms', exam_type:'FINAL', start_time:'2025-05-12T09:00:00Z', end_time:'2025-05-12T11:00:00Z', semester:'Spring 2025', credit_hours:4 },
  { id:'2', course_code:'MATH301', course_title:'Linear Algebra', exam_type:'MIDTERM', start_time:'2025-05-12T10:30:00Z', end_time:'2025-05-12T12:00:00Z', semester:'Spring 2025', credit_hours:3 },
  { id:'3', course_code:'PHYS201', course_title:'Mechanics', exam_type:'FINAL', start_time:'2025-05-14T14:00:00Z', end_time:'2025-05-14T16:00:00Z', semester:'Spring 2025', credit_hours:4 },
  { id:'4', course_code:'CS350', course_title:'Operating Systems', exam_type:'QUIZ', start_time:'2025-05-15T13:00:00Z', end_time:'2025-05-15T13:45:00Z', semester:'Spring 2025', credit_hours:3 },
  { id:'5', course_code:'ENG201', course_title:'Tech Writing', exam_type:'FINAL', start_time:'2025-05-16T09:00:00Z', end_time:'2025-05-16T11:00:00Z', semester:'Spring 2025', credit_hours:2 },
]
const COLORS: Record<string,string> = { FINAL:'#ef4444', MIDTERM:'#f97316', QUIZ:'#3b82f6', ASSIGNMENT:'#22c55e' }

export default function AnalyticsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    examsApi.list().then(({ exams: l }) => setExams(l)).catch(() => setExams(DEMO)).finally(() => setLoading(false))
  }, [])

  const totalCredits = exams.reduce((s, e) => s + (e.credit_hours || 0), 0)
  const finals = exams.filter(e => e.exam_type === 'FINAL').length
  const typeCounts: Record<string,number> = {}
  exams.forEach(e => { typeCounts[e.exam_type] = (typeCounts[e.exam_type] || 0) + 1 })
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))
  const dayMap: Record<string,number> = {}
  exams.forEach(e => { const d = format(new Date(e.start_time), 'MMM d'); dayMap[d] = (dayMap[d]||0)+1 })
  const dailyData = Object.entries(dayMap).map(([date, count]) => ({ date, count }))
  const creditData = exams.map(e => ({ name: e.course_code, credits: e.credit_hours||0, type: e.exam_type }))

  if (loading) return <div className="max-w-5xl mx-auto space-y-6"><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><CardSkeleton key={i}/>)}</div></div>

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-white/40 mt-0.5">Workload analysis and schedule insights</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Exams" value={exams.length} icon="📋" />
        <StatCard label="Credit Hours" value={totalCredits} accent="text-blue-400" icon="📚" />
        <StatCard label="Finals" value={finals} accent="text-red-400" icon="🎓" />
        <StatCard label="Subjects" value={new Set(exams.map(e=>e.course_code)).size} accent="text-emerald-400" icon="📖" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Exam Types</h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map(entry => <Cell key={entry.name} fill={COLORS[entry.name]||'#94a3b8'} />)}
              </Pie>
              <Tooltip contentStyle={{ background:'#111827', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, fontSize:11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="lg:col-span-2 p-5">
          <h2 className="text-sm font-semibold text-white/70 mb-4">Exams per Day</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={dailyData} barSize={28}>
              <XAxis dataKey="date" tick={{ fontSize:11, fill:'rgba(255,255,255,.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'rgba(255,255,255,.3)' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background:'#111827', border:'1px solid rgba(255,255,255,.1)', borderRadius:8, fontSize:11 }} />
              <Bar dataKey="count" fill="#22c55e" radius={[4,4,0,0]} name="Exams" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card className="p-5">
        <h2 className="text-sm font-semibold text-white/70 mb-4">Schedule Detail</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-white/8">
              {['Course','Title','Type','Date','Credits'].map(h=><th key={h} className="text-left pb-2 pr-4 text-white/30 font-medium">{h}</th>)}
            </tr></thead>
            <tbody className="divide-y divide-white/5">
              {exams.map(exam => (
                <tr key={exam.id} className="hover:bg-white/3">
                  <td className="py-2.5 pr-4 font-mono text-white/50">{exam.course_code}</td>
                  <td className="py-2.5 pr-4 text-white/70 max-w-[160px] truncate">{exam.course_title}</td>
                  <td className="py-2.5 pr-4"><ExamTypeBadge type={exam.exam_type} /></td>
                  <td className="py-2.5 pr-4 text-white/50">{format(new Date(exam.start_time),'MMM d, yyyy')}</td>
                  <td className="py-2.5 text-white/50">{exam.credit_hours||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
          }
