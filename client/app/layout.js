import { ClerkProvider } from '@clerk/nextjs'
import { Bebas_Neue, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const display = Bebas_Neue({ weight:'400', subsets:['latin'], variable:'--font-display' })
const body = DM_Sans({ subsets:['latin'], variable:'--font-body' })
const mono = DM_Mono({ weight:['400','500'], subsets:['latin'], variable:'--font-mono' })

export const metadata = {
  title: 'ExamFlow AI — Intelligent Exam Scheduling',
  description: 'AI-powered exam scheduling, conflict detection, and personalised study plans.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={[display.variable, body.variable, mono.variable].join(' ')}>
        <body className="bg-ink-950 text-white antialiased font-body">{children}</body>
      </html>
    </ClerkProvider>
  )
}
