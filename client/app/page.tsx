import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'ExamFlow AI — Intelligent Exam Scheduling' }

const FEATURES = [
  { icon: '⚡', title: 'Conflict Detection', desc: 'Automatically detects scheduling conflicts across your full exam calendar' },
  { icon: '🧠', title: 'AI Study Plans', desc: 'Claude AI generates personalised day-by-day study schedules with streaming' },
  { icon: '📊', title: 'Workload Analytics', desc: 'Visual breakdown of credit hours, risk scores, and daily density' },
  { icon: '💬', title: 'Natural Language Input', desc: 'Paste plain English — AI parses course, date, time, and location automatically' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <nav className="border-b border-white/8 backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-xs font-bold text-black">EF</div>
            <span className="font-semibold text-sm">ExamFlow AI</span>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <Link href="/sign-in" className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5">Sign In</Link>
              <Link href="/sign-up" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors">Get Started</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="text-sm bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors">Dashboard →</Link>
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-full px-4 py-1.5 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Powered by Claude AI · Now in Beta
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold leading-tight tracking-tight mb-6">
          Exam scheduling,{' '}
          <span className="text-emerald-400">intelligently.</span>
        </h1>

        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          ExamFlow AI detects conflicts, generates personalised study plans, and analyses your academic workload — all powered by Claude AI.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/sign-up" className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
            Start for free →
          </Link>
          <Link href="/dashboard" className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-6 py-3 rounded-xl text-sm transition-all">
            View demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="border border-white/8 rounded-xl p-5 bg-white/2 hover:border-emerald-500/30 hover:bg-white/4 transition-all group">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-semibold mb-1.5 group-hover:text-emerald-400 transition-colors">{f.title}</h3>
              <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-white/8 py-8 mb-0">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[['10k+', 'Exams Scheduled'], ['98%', 'Conflict Detection Rate'], ['< 3s', 'AI Response Time']].map(([val, label]) => (
              <div key={label}>
                <p className="text-2xl font-bold text-emerald-400 mb-1">{val}</p>
                <p className="text-xs text-white/40">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-white/25">
        <span>© 2025 ExamFlow AI</span>
        <span>Built with Next.js · Express · Claude AI · Supabase</span>
      </footer>
    </div>
  )
}
