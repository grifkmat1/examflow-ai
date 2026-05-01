'use client'
import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import { examsApi } from '@/lib/api'
import type { Exam } from '@/lib/types'
import { StatCard, Card, ExamTypeBadge, CardSkeleton } from '@/components/ui'
import { format } from 'date-fns'

const DEMO: Exam[] = [
  { id: '1', course_code: 'CS401', course_title: 'Algorithms', exam_type: 'FINAL', start_time: '2025-05-12T09:00:00Z', end_time: '2025-05-12T11:00:00Z', semester: 'Spring 2025', credit_hours: 4 },
  { id: '2', course_code: 'MATH301', course_title: 'Linear Algebra', exam_type: 'MIDTERM', start_time: '2025-05-12T10:30:00Z', end_time: '2025-05-12T12:00:00Z', semester: 'Spring 2025', credit_hours: 3 },
  { id: '3', course_code: 'PHYS201', course_title: 'Mechanics', exam_type: 'FINAL', start_time: '2025-05-14T14:00:00Z', end_time: '2025-05-14T16:00:00Z', semester: 'Spring 2025', credit_hours: 4 },
  { id: '4', course_code: 'CS350', course_title: 'OS', exam_type: 'QUIZ', start_time: '2025-05-15T13:00:00Z', end_time: '2025-05-15T13:45:00Z', semester: 'Spring 2025', credit_hours: 3 },
  { id: '5', course_code: 'ENG201', course_title: 'Tech Writing', exam_type: 'FINAL', start_time: '2025-05-16T09:00:00Z', end_time: '2025-05-16T11:00:00Z', semester: 'Spring 2025', credit_hours: 2 },
]

const COLORS = { FINAL: '#ef4444', MIDTERM: '#f97316', QUIZ: '#3b82f6', ASSIGNMENT: '#22c55e' }

const CustomTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="card p-2.5 text-xs shadow-lg">
      <p className="font-medium text-surface-600 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name || p.dataKey}: <strong>{p.value}</strong></p>
      ))}
    </div>
  ) : null

export default function AnalyticsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    examsApi.list()
      .then(({ exams: list }) => setExams(list))
      .catch(() => setExams(DEMO))
      .finally(() => setLoading(false))
  }, [])

  const totalCredits = exams.reduce((s, e) => s + (e.credit_hours || 0), 0)
  const finals = exams.filter(e => e.exam_type === 'FINAL').length
  const conflicts = exams.filter((_, i) => {
    const next = exams[i + 1]
    if (!next) return false
    return Math.abs(new Date(_.start_time).getTime() - new Date(next.start_time).getTime()) < 2 * 60 * 60 * 1000
  }).length

  // Type breakdown for pie
  const typeCounts: Record<string, number> = {}
  exams.forEach(e => { typeCounts[e.exam_type] = (typeCounts[e.exam_type] || 0) + 1 })
  const pieData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }))

  // Daily distribution
  const dayMap: Record<string, number> = {}
  exams.forEach(e => {
    const d = format(new Date(e.start_time), 'MMM d')
    dayMap[d] = (dayMap[d] || 0) + 1
  })
  const dailyData = Object.entries(dayMap).map(([date, count]) => ({ date, count }))

  // Credit distribution
  const creditData = exams.map(e => ({
    name: e.course_code,
    credits: e.credit_hours || 0,
    type: e.exam_type,
  }))

  // Estimated study hours (rough heuristic)
  const studyData = [
    { week: 'Wk 1', planned: 12, actual: 10 },
    { week: 'Wk 2', planned: 16, actual: 14 },
    { week: 'Wk 3', planned: 20, actual: 18 },
    { week: 'Exam Wk', planned: 24, actual: 22 },
  ]

  if (loading) return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="skeleton h-8 w-48 rounded" />
      <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <CardSkeleton key={i} />)}</div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
        <p className="text-sm text-surface-500 mt-0.5">Workload analysis and schedule insights</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Exams" value={exams.length} icon={<span>📋</span>} />
        <StatCard label="Credit Hours" value={totalCredits} color="blue" icon={<span>📚</span>} />
        <StatCard label="Finals" value={finals} color="red" icon={<span>🎓</span>} />
        <StatCard label="Potential Conflicts" value={conflicts} color={conflicts > 0 ? 'red' : 'green'} icon={<span>⚠️</span>} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Exam Types</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[d.name as keyof typeof COLORS] || '#94a3b8' }} />
                <span className="text-[10px] text-surface-500">{d.name}: {d.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Exams per Day</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData} barSize={32}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} name="Exams" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Credit Hours by Course</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={creditData} barSize={28}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="credits" radius={[4, 4, 0, 0]} name="Credits">
                {creditData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry.type as keyof typeof COLORS] || '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Estimated Study Hours</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={studyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Planned" />
              <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Exam detail table */}
      <Card>
        <h2 className="text-sm font-semibold text-surface-700 mb-4">Schedule Detail</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-100">
                {['Course', 'Title', 'Type', 'Date', 'Duration', 'Credits', 'Risk'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-surface-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {exams.map(exam => {
                const start = new Date(exam.start_time)
                const end = new Date(exam.end_time)
                const dur = Math.round((end.getTime() - start.getTime()) / 60000)
                const risk = exam.exam_type === 'FINAL' ? 'HIGH' : exam.exam_type === 'MIDTERM' ? 'MED' : 'LOW'
                const riskColor = { HIGH: 'text-red-600', MED: 'text-orange-600', LOW: 'text-green-600' }[risk]
                return (
                  <tr key={exam.id} className="hover:bg-surface-50">
                    <td className="py-2.5 pr-4 font-mono text-surface-500">{exam.course_code}</td>
                    <td className="py-2.5 pr-4 text-surface-700 max-w-[160px] truncate">{exam.course_title}</td>
                    <td className="py-2.5 pr-4"><ExamTypeBadge type={exam.exam_type} /></td>
                    <td className="py-2.5 pr-4 text-surface-500">{format(start, 'MMM d, yyyy')}</td>
                    <td className="py-2.5 pr-4 text-surface-500">{dur}m</td>
                    <td className="py-2.5 pr-4 text-surface-500">{exam.credit_hours || '—'}</td>
                    <td className={`py-2.5 pr-4 font-semibold ${riskColor}`}>{risk}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
