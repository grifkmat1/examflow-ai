import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function Home() {
  const features = ['⚡ Conflict Detection','🧠 AI Study Plans','📊 Workload Analytics','💬 NLP Exam Parser','🔐 Clerk Auth','🐘 Supabase DB']
  return (
    <main className="min-h-screen flex flex-col bg-ink-950">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <span style={{fontFamily:'Bebas Neue,serif',fontSize:'1.5rem',letterSpacing:'.15em',color:'#c8ff00'}}>EXAMFLOW</span>
        <div className="flex gap-3">
          <SignedOut>
            <Link href="/sign-in" className="btn-ghost text-sm">Sign In</Link>
            <Link href="/sign-up" className="btn-acid text-sm">Get Started</Link>
          </SignedOut>
          <SignedIn><Link href="/dashboard" className="btn-acid text-sm">Dashboard →</Link></SignedIn>
        </div>
      </nav>
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-ink-800 border border-white/10 rounded-full px-4 py-2 text-xs text-white/60 mb-8">
          <span className="w-1.5 h-1.5 bg-acid-400 rounded-full inline-block" style={{animation:'pulse 2s infinite'}} />
          Powered by Claude AI
        </div>
        <h1 style={{fontFamily:'Bebas Neue,serif',fontSize:'clamp(4rem,12vw,9rem)',lineHeight:1,letterSpacing:'.05em'}} className="mb-6">
          <span className="text-white">EXAM</span><span style={{color:'#c8ff00'}}>FLOW</span>
        </h1>
        <p className="text-white/50 text-lg max-w-lg mb-10 leading-relaxed">
          Schedule smarter. Study better. Detect conflicts before they happen.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/sign-up" className="btn-acid px-8 py-3 text-base">Start Free →</Link>
          <Link href="/dashboard" className="btn-ghost px-8 py-3 text-base">View Demo</Link>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-14">
          {features.map(f => <span key={f} className="bg-ink-800 border border-white/8 rounded-full px-4 py-1.5 text-xs text-white/50">{f}</span>)}
        </div>
      </section>
      <footer className="text-center py-6 text-white/20 text-xs border-t border-white/5">ExamFlow AI v2.0 — Built with Next.js + Claude AI</footer>
    </main>
  )
}
