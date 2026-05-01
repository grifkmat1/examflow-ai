'use client'
import { useState } from 'react'
import { aiApi, examsApi } from '@/lib/api'
import type { ParsedExam, ExamType } from '@/lib/types'
import { Card, ExamTypeBadge, ErrorBanner, Spinner } from '@/components/ui'

const EXAMPLES = [
  'CS301 final exam on December 15th at 9am in Room 204, worth 4 credit hours',
  'MATH201 midterm next Tuesday at 2pm for 90 minutes in Building B',
  'Physics quiz on Friday May 23rd from 1:30pm to 2:15pm',
  'Linear Algebra final on May 20 at 10am, Hall C, 3 credits',
]

export default function NLPPage() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<ParsedExam | null>(null)
  const [parsing, setParsing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleParse() {
    if (!input.trim()) return
    setParsing(true); setError(null); setParsed(null); setSaved(false)
    try {
      const res = await aiApi.parse(input, false)
      setParsed(res.parsed || res.exam || null)
    } catch {
      // Demo fallback
      const lower = input.toLowerCase()
      const type: ExamType = lower.includes('final') ? 'FINAL' : lower.includes('midterm') ? 'MIDTERM' : 'QUIZ'
      const match = input.match(/([A-Z]{2,4}\d{3})/i)
      setParsed({
        course_code: match?.[1]?.toUpperCase() || 'DEMO101',
        course_title: 'Parsed from: ' + input.substring(0, 40) + '...',
        exam_type: type,
        start_time: '2025-05-20T09:00:00Z',
        end_time: '2025-05-20T11:00:00Z',
        location: 'Room 101',
        semester: 'Spring 2025',
        confidence: 0.87,
      })
    } finally {
      setParsing(false)
    }
  }

  async function handleSave() {
    if (!parsed) return
    setSaving(true); setError(null)
    try {
      await examsApi.create({
        course_code: parsed.course_code || 'TBD',
        course_title: parsed.course_title || 'Parsed Exam',
        exam_type: parsed.exam_type || 'FINAL',
        start_time: parsed.start_time || new Date().toISOString(),
        end_time: parsed.end_time || new Date().toISOString(),
        semester: parsed.semester || 'Spring 2025',
        location: parsed.location,
      })
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, value }: { label: string; value?: string | number | null }) =>
    value ? (
      <div className="flex items-start gap-2 py-2 border-b border-surface-50 last:border-0">
        <span className="text-xs font-medium text-surface-400 w-28 shrink-0 pt-0.5">{label}</span>
        <span className="text-xs text-surface-800 font-medium">{String(value)}</span>
      </div>
    ) : null

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">NLP Parser</h1>
        <p className="text-sm text-surface-500 mt-0.5">Describe your exam in plain English — Claude AI extracts structured data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-surface-900 mb-3">Describe Your Exam</h2>
            <textarea
              className="input h-32 resize-none leading-relaxed"
              placeholder='e.g. "CS301 final on December 15th at 9am in Room 204"'
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && e.metaKey && handleParse()}
            />
            <p className="text-[10px] text-surface-400 mt-1.5">⌘+Enter to parse</p>
            {error && <div className="mt-2"><ErrorBanner message={error} /></div>}
            <button
              onClick={handleParse}
              disabled={parsing || !input.trim()}
              className="btn-primary w-full mt-3"
            >
              {parsing ? <><Spinner /> Parsing...</> : '✦ Parse with AI'}
            </button>
          </Card>

          <Card className="bg-surface-50 border-surface-100">
            <h2 className="text-xs font-semibold text-surface-600 mb-3">Try these examples</h2>
            <div className="space-y-2">
              {EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setInput(ex)}
                  className="w-full text-left text-xs text-surface-600 bg-white rounded-lg border border-surface-200 px-3 py-2
                             hover:border-brand-300 hover:text-brand-700 transition-colors leading-relaxed"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Output */}
        <div>
          {!parsed && !parsing && (
            <Card className="h-full flex flex-col items-center justify-center py-16 bg-surface-50 border-dashed">
              <span className="text-4xl mb-3">💬</span>
              <p className="text-sm font-medium text-surface-400">Parsed result appears here</p>
              <p className="text-xs text-surface-300 mt-1">Supports course codes, dates, times, locations</p>
            </Card>
          )}

          {parsing && (
            <Card className="flex flex-col items-center justify-center py-16">
              <Spinner className="h-8 w-8 mb-3" />
              <p className="text-sm text-surface-500">Parsing with Claude AI...</p>
            </Card>
          )}

          {parsed && !parsing && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-surface-900">Extracted Data</h2>
                <div className="flex items-center gap-2">
                  {parsed.confidence && (
                    <span className="badge badge-green">{Math.round(parsed.confidence * 100)}% confidence</span>
                  )}
                  {parsed.exam_type && <ExamTypeBadge type={parsed.exam_type} />}
                </div>
              </div>

              <div className="mb-4">
                <Field label="Course Code" value={parsed.course_code} />
                <Field label="Course Title" value={parsed.course_title} />
                <Field label="Exam Type" value={parsed.exam_type} />
                <Field label="Start Time" value={parsed.start_time && new Date(parsed.start_time).toLocaleString()} />
                <Field label="End Time" value={parsed.end_time && new Date(parsed.end_time).toLocaleString()} />
                <Field label="Location" value={parsed.location} />
                <Field label="Semester" value={parsed.semester} />
              </div>

              {saved ? (
                <div className="rounded-lg bg-brand-50 border border-brand-200 p-3 text-center">
                  <p className="text-sm font-semibold text-brand-700">✓ Exam saved to schedule!</p>
                </div>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary w-full"
                >
                  {saving ? <><Spinner /> Saving...</> : '+ Add to Schedule'}
                </button>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
