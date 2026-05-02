import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ExamFlow AI',
  description: 'AI-powered exam scheduling and conflict detection.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-white/8 bg-gray-950/80 sticky top-0 z-10 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">EF</div>
            <span className="font-semibold text-sm">ExamFlow AI</span>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full px-2 py-0.5 font-medium ml-1">Live Demo</span>
          </div>
          <Link href="/dashboard" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors">
            Open Dashboard
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by Claude AI · No sign-up required
        </div>
        <h1 className="text-5xl font-bold leading-tight tracking-tight mb-6">
          Stop guessing.{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Schedule exams intelligently.
          </span>
        </h1>
        <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
          ExamFlow AI detects scheduling conflicts, generates personalised AI study plans,
          and visualises your academic workload.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/dashboard" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-7 py-3 rounded-xl text-sm transition-all shadow-xl shadow-emerald-500/25">
            Try live demo
          </Link>
          <Link href="/exams" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-7 py-3 rounded-xl text-sm transition-all">
            View Exams
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/25">Full demo data · No credit card</p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-white/10 bg-gray-900/80 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/8 bg-gray-900">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="ml-3 text-xs text-white/30 font-mono">examflow-live.vercel.app/dashboard</span>
          </div>
          <div className="flex">
            <div className="w-44 shrink-0 border-r border-white/8 p-3 space-y-1 bg-gray-900/60">
              {['⊞ Dashboard','📋 Exams','🧠 Study Plans','📊 Analytics','💬 NLP Parser'].map((item, i) => (
                <div key={item} className={"px-3 py-2 rounded-lg text-xs " + (i === 0 ? 'bg-emerald-500/15 text-emerald-400' : 'text-white/35')}>
                  {item}
                </div>
              ))}
            </div>
            <div className="flex-1 p-5">
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[{l:'Exams',v:'5',c:'text-white'},{l:'Conflicts',v:'1',c:'text-red-400'},{l:'Credit Hrs',v:'16',c:'text-blue-400'},{l:'Risk',v:'HIGH',c:'text-orange-400'}].map(s => (
                  <div key={s.l} className="bg-gray-800/60 rounded-lg p-3 border border-white/6">
                    <p className="text-[10px] text-white/35 mb-1">{s.l}</p>
                    <p className={"text-lg font-bold " + s.c}>{s.v}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red-500/8 border border-red-500/20 rounded-lg p-3 mb-4 flex items-start gap-2">
                <span className="text-red-400 text-xs">⚠</span>
                <div>
                  <p className="text-xs font-medium text-red-400">Scheduling conflict detected</p>
                  <p className="text-[10px] text-white/40 mt-0.5">CS401 and MATH301 overlap by 30 minutes on May 12th</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[{code:'CS401',title:'Algorithms',type:'FINAL',date:'May 12 · 9am'},{code:'MATH301',title:'Linear Algebra',type:'MIDTERM',date:'May 12 · 10:30am'},{code:'PHYS201',title:'Mechanics',type:'FINAL',date:'May 14 · 2pm'}].map(e => (
                  <div key={e.code} className="bg-gray-800/50 rounded-lg p-3 border border-white/6">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] font-mono text-white/35">{e.code}</span>
                      <span className={"text-[8px] font-medium px-1.5 py-0.5 rounded-full " + (e.type === 'FINAL' ? 'bg-red-500/15 text-red-400' : 'bg-orange-500/15 text-orange-400')}>{e.type}</span>
                    </div>
                    <p className="text-[11px] font-medium text-white/80 mb-1">{e.title}</p>
                    <p className="text-[10px] text-white/35">{e.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-2 gap-4">
        {[
          { icon: '⚡', title: 'Conflict Detection', desc: 'Instantly flags overlapping or back-to-back exams.', tag: 'Rule-based + AI', color: 'border-amber-500/20' },
          { icon: '🧠', title: 'Claude AI Study Plans', desc: 'Personalised day-by-day study schedules, streamed live.', tag: 'Claude 3.5 Sonnet', color: 'border-emerald-500/20' },
          { icon: '📊', title: 'Workload Analytics', desc: 'Credit hours, risk scores, and daily exam density charts.', tag: 'Recharts', color: 'border-blue-500/20' },
          { icon: '💬', title: 'NLP Parser', desc: 'Describe an exam in English — AI structures it instantly.', tag: 'Claude AI', color: 'border-violet-500/20' },
        ].map(f => (
          <div key={f.title} className={"p-6 rounded-2xl border bg-white/2 hover:bg-white/4 transition-all " + f.color}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{f.icon}</span>
              <span className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded-full font-mono">{f.tag}</span>
            </div>
            <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
            <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-white/8 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-white/25">
          <span>ExamFlow AI v2.0</span>
          <Link href="https://github.com/grifkmat1/examflow-ai" className="hover:text-white/50 transition-colors">GitHub →</Link>
          <span>Next.js · Claude AI · Supabase</span>
        </div>
      </footer>
    </div>
  )
}
