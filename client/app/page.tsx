import Link from 'next/link'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'ExamFlow AI — Exam Scheduling, Reimagined',
  description: 'Detect conflicts, generate AI study plans, and analyse your workload — all in one platform.',
}


const FEATURES = [
  { icon: '⚡', title: 'Instant Conflict Detection', desc: 'Submit your exam schedule and ExamFlow instantly flags overlapping or back-to-back exams — before they become a problem.', color: 'from-amber-500/20 to-orange-500/5', border: 'border-amber-500/20', tag: 'Rule-based + AI' },
  { icon: '🧠', title: 'Claude AI Study Plans', desc: 'ExamFlow builds a personalised day-by-day study schedule, streamed directly to your screen in real time.', color: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/20', tag: 'Streaming · Claude 3.5' },
  { icon: '📊', title: 'Workload Analytics', desc: 'Visualise credit hours, exam density, and risk scores across your semester with interactive charts.', color: 'from-blue-500/20 to-indigo-500/5', border: 'border-blue-500/20', tag: 'Recharts · Real-time' },
  { icon: '💬', title: 'Natural Language Parser', desc: 'Type "CS301 final on Dec 15 at 9am in Room 204" and ExamFlow parses course, date, time, and location automatically.', color: 'from-violet-500/20 to-purple-500/5', border: 'border-violet-500/20', tag: 'Claude AI · NLP' },
]


const TECH = ['Next.js 14','TypeScript','Node.js','Claude AI','PostgreSQL','Supabase','Docker','Render','Vercel']


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />


      {/* Nav */}
      <nav className="relative z-10 border-b border-white/8 bg-gray-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">EF</div>
            <span className="font-semibold text-sm">ExamFlow AI</span>
            <span className="hidden sm:inline-flex ml-1 text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full px-2 py-0.5 font-medium">Live Demo</span>
          </div>
          <Link href="/dashboard" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
            Open Dashboard →
          </Link>
        </div>
      </nav>


      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by Anthropic Claude · Live demo — no sign-up required
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.1] tracking-tight mb-6">
          Stop guessing.<br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Schedule exams intelligently.</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          ExamFlow AI detects scheduling conflicts, generates personalised AI study plans, and visualises your academic workload — so you can focus on studying, not spreadsheets.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-7 py-3 rounded-xl text-sm transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105">
            Try live demo →
          </Link>
          <Link href="/exams" className="w-full sm:w-auto border border-white/12 hover:border-white/25 bg-white/4 hover:bg-white/8 text-white/70 hover:text-white px-7 py-3 rounded-xl text-sm transition-all">
            View Exams page
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/25">No sign-up · No credit card · Full demo data</p>
      </section>


      {/* Mock dashboard preview */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="relative rounded-2xl border border-white/10 bg-gray-900/80 overflow-hidden shadow-2xl shadow-black/40">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-gray-900">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-xs text-white/30 font-mono">examflow-ai.vercel.app/dashboard</span>
          </div>
          <div className="flex">
            <div className="w-44 shrink-0 border-r border-white/8 p-3 space-y-1 bg-gray-900/60">
              {['⊞ Dashboard','📋 Exams','🧠 Study Plans','📊 Analytics','💬 NLP Parser'].map((item, i) => (
                <div key={item} className={`px-3 py-2 rounded-lg text-xs ${i === 0 ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/35'}`}>{item}</div>
              ))}
            </div>
            <div className="flex-1 p-5">
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[{l:'Exams',v:'5',c:'text-white'},{l:'Conflicts',v:'1',c:'text-red-400'},{l:'Credit Hrs',v:'16',c:'text-blue-400'},{l:'Risk',v:'HIGH',c:'text-orange-400'}].map(s => (
                  <div key={s.l} className="bg-gray-800/60 rounded-lg p-3 border border-white/6">
                    <p className="text-[10px] text-white/35 mb-1">{s.l}</p>
// v2.1
