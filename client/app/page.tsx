import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ExamFlow AI — Exam Scheduling, Reimagined',
  description: 'Detect conflicts, generate AI study plans, and analyse your workload — all in one platform built for students who take their grades seriously.',
}

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Conflict Detection',
    desc: 'Submit your exam schedule and ExamFlow instantly flags overlapping or back-to-back exams — before they become a problem.',
    color: 'from-amber-500/20 to-orange-500/5',
    border: 'border-amber-500/20',
    tag: 'Rule-based + AI',
  },
  {
    icon: '🧠',
    title: 'Claude AI Study Plans',
    desc: 'Describe your courses and ExamFlow builds a personalised day-by-day study schedule, streamed directly to your screen in real time.',
    color: 'from-emerald-500/20 to-teal-500/5',
    border: 'border-emerald-500/20',
    tag: 'Streaming · Claude 3.5',
  },
  {
    icon: '📊',
    title: 'Workload Analytics',
    desc: 'Visualise credit hours, exam density, and risk scores across your semester so you never sleep on a high-stakes finals week again.',
    color: 'from-blue-500/20 to-indigo-500/5',
    border: 'border-blue-500/20',
    tag: 'Recharts · Real-time',
  },
  {
    icon: '💬',
    title: 'Natural Language Parser',
    desc: 'Type "CS301 final on Dec 15 at 9am in Room 204" and ExamFlow parses course, date, time, and location automatically.',
    color: 'from-violet-500/20 to-purple-500/5',
    border: 'border-violet-500/20',
    tag: 'Claude AI · NLP',
  },
]

const STATS = [
  { val: '< 200ms', label: 'Conflict detection time' },
  { val: 'SSE', label: 'Real-time streaming plans' },
  { val: '5 pages', label: 'Fully connected UI' },
]

const TECH = ['Next.js 14', 'TypeScript', 'Node.js', 'Claude AI', 'PostgreSQL', 'Supabase', 'Clerk', 'Docker', 'Render', 'Vercel']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Subtle grid background ── */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      {/* ── Nav ── */}
      <nav className="relative z-10 border-b border-white/8 bg-gray-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold text-black select-none">EF</div>
            <span className="font-semibold text-sm tracking-tight">ExamFlow AI</span>
            <span className="hidden sm:inline-flex ml-1 text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full px-2 py-0.5 font-medium">Beta</span>
          </div>
          <div className="flex items-center gap-2">
            <SignedOut>
              <Link href="/sign-in" className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                Sign in
              </Link>
              <Link href="/sign-up" className="text-sm bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                Get started free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors">
                Dashboard →
              </Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by Anthropic Claude · Server-sent events · Real-time streaming
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.1] tracking-tight mb-6">
          Stop guessing.<br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Schedule exams intelligently.
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          ExamFlow AI detects scheduling conflicts, generates personalised AI study plans,
          and visualises your academic workload — so you can focus on studying, not spreadsheets.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-semibold px-7 py-3 rounded-xl text-sm transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            Start scheduling free →
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto border border-white/12 hover:border-white/25 bg-white/4 hover:bg-white/8 text-white/70 hover:text-white px-7 py-3 rounded-xl text-sm transition-all"
          >
            View live demo
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-xs text-white/25">No credit card · Full demo data · Instant setup</p>
      </section>

      {/* ── Fake dashboard preview ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="relative rounded-2xl border border-white/10 bg-gray-900/80 overflow-hidden shadow-2xl shadow-black/40 backdrop-blur">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-gray-900">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-xs text-white/30 font-mono">examflow.app/dashboard</span>
          </div>

          {/* Mock dashboard */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-44 shrink-0 border-r border-white/8 p-3 space-y-1 bg-gray-900/60">
              {['⊞ Dashboard','📋 Exams','🧠 Study Plans','📊 Analytics','💬 NLP Parser'].map((item, i) => (
                <div key={item} className={`px-3 py-2 rounded-lg text-xs ${i === 0 ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/35'}`}>
                  {item}
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 p-5">
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Exams', val: '5', color: 'text-white' },
                  { label: 'Conflicts', val: '1', color: 'text-red-400' },
                  { label: 'Credit Hrs', val: '16', color: 'text-blue-400' },
                  { label: 'Risk Score', val: 'HIGH', color: 'text-orange-400' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-800/60 rounded-lg p-3 border border-white/6">
                    <p className="text-[10px] text-white/35 mb-1">{s.label}</p>
                    <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Conflict banner */}
              <div className="bg-red-500/8 border border-red-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
                <span className="text-red-400 text-xs mt-0.5">⚠</span>
                <div>
                  <p className="text-xs font-medium text-red-400">Scheduling conflict detected</p>
                  <p className="text-[10px] text-white/40 mt-0.5">CS401 and MATH301 overlap by 30 minutes on May 12th</p>
                </div>
              </div>

              {/* Exam cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { code: 'CS401', title: 'Algorithms', type: 'FINAL', date: 'May 12 · 9am' },
                  { code: 'MATH301', title: 'Linear Algebra', type: 'MIDTERM', date: 'May 12 · 10:30am' },
                  { code: 'PHYS201', title: 'Mechanics', type: 'FINAL', date: 'May 14 · 2pm' },
                ].map(e => (
                  <div key={e.code} className="bg-gray-800/50 rounded-lg p-3 border border-white/6">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] font-mono text-white/35">{e.code}</span>
                      <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${e.type === 'FINAL' ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400'}`}>{e.type}</span>
                    </div>
                    <p className="text-[11px] font-medium text-white/80 mb-1">{e.title}</p>
                    <p className="text-[10px] text-white/35">{e.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
        </div>

        <p className="text-center text-xs text-white/25 mt-4">Live demo — no login required</p>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Everything you need to ace finals week</h2>
          <p className="text-white/40 text-sm max-w-lg mx-auto">Four tools. One platform. Zero scheduling disasters.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className={`relative p-6 rounded-2xl border bg-gradient-to-br ${f.color} ${f.border} group hover:border-opacity-60 transition-all hover:scale-[1.01]`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{f.icon}</span>
                <span className="text-[10px] text-white/35 bg-white/6 px-2 py-1 rounded-full font-mono">{f.tag}</span>
              </div>
              <h3 className="text-base font-semibold mb-2 group-hover:text-white transition-colors">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 border-y border-white/8 py-12 mb-0">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1.5">{s.val}</p>
              <p className="text-xs text-white/35">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-xs text-white/25 mb-5 uppercase tracking-widest font-medium">Built with</p>
        <div className="flex flex-wrap justify-center gap-2">
          {TECH.map(t => (
            <span key={t} className="text-xs text-white/45 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full hover:text-white/70 hover:border-white/15 transition-colors">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24 text-center">
        <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to stop stress-scheduling?</h2>
          <p className="text-white/45 text-sm mb-8 max-w-md mx-auto">
            Add your exams, detect conflicts, and get an AI study plan in under two minutes.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95"
          >
            Get started — it's free →
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-black">EF</div>
            <span>ExamFlow AI · v2.0</span>
          </div>
          <span>Next.js · Express · Claude AI · PostgreSQL · Supabase</span>
          <span>MIT License</span>
        </div>
      </footer>

    </div>
  )
}
