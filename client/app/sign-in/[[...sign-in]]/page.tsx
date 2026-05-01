import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sign In | ExamFlow AI' }

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-sm font-bold text-black">EF</div>
          <span className="font-semibold text-white text-lg">ExamFlow AI</span>
        </div>
        <p className="text-sm text-white/40">Welcome back</p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-gray-900 border border-white/10 shadow-2xl rounded-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-white/50',
            socialButtonsBlockButton: 'bg-white/5 border-white/10 text-white hover:bg-white/10',
            formFieldLabel: 'text-white/60 text-xs',
            formFieldInput: 'bg-gray-800 border-white/10 text-white placeholder-white/20 focus:border-emerald-500',
            formButtonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-black font-semibold',
            footerActionLink: 'text-emerald-400 hover:text-emerald-300',
            dividerLine: 'bg-white/10',
            dividerText: 'text-white/30',
          },
        }}
      />
    </main>
  )
}
