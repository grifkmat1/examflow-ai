import type {
  Exam, CreateExamInput, ExamsListResponse, ConflictsResponse,
  StudyPlanRequest, StudyPlanResponse, WorkloadData, ScheduleAnalytics,
  ParseResponse, RecommendationResponse,
} from './types'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }))
    throw new ApiError(res.status, body.message || `HTTP ${res.status}`)
  }
  return res.json()
}

// ─── Exams ───────────────────────────────────────────────────────────────────

export const examsApi = {
  list: () => request<ExamsListResponse>('/api/v1/exams'),
  get: (id: string) => request<{ exam: Exam }>(`/api/v1/exams/${id}`),
  create: (data: CreateExamInput) =>
    request<{ exam: Exam }>('/api/v1/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ message: string }>(`/api/v1/exams/${id}`, { method: 'DELETE' }),
  detectConflicts: (exams: Exam[]) =>
    request<ConflictsResponse>('/api/v1/exams/detect-conflicts', {
      method: 'POST',
      body: JSON.stringify({ exams }),
    }),
}

// ─── Study Plans ─────────────────────────────────────────────────────────────

export const studyPlansApi = {
  generate: (data: StudyPlanRequest) =>
    request<StudyPlanResponse>('/api/v1/ai/study-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  stream: async (
    data: StudyPlanRequest,
    onChunk: (chunk: string, full: string) => void,
    onDone: (full: string) => void,
    onError: (error: Error) => void
  ): Promise<void> => {
    try {
      const res = await fetch(`${BASE}/api/v1/ai/study-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, stream: true }),
      })
      if (!res.ok) throw new ApiError(res.status, 'Stream request failed')
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const raw = decoder.decode(value, { stream: true })
        for (const line of raw.split('\n')) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data:')) continue
          const payload = trimmed.slice(5).trim()
          if (payload === '[DONE]') { onDone(full); return }
          try {
            const parsed = JSON.parse(payload)
            const text = parsed.content || parsed.text || parsed.chunk || parsed.delta || ''
            if (text) { full += text; onChunk(text, full) }
          } catch {
            if (payload && payload !== '[DONE]') { full += payload; onChunk(payload, full) }
          }
        }
      }
      onDone(full)
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)))
    }
  },
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analyticsApi = {
  workload: (codes: string[], semester: string) =>
    request<WorkloadData>('/api/v1/analytics/workload', {
      method: 'POST',
      body: JSON.stringify({ codes, semester }),
    }),
  schedule: (codes: string[], semester: string) =>
    request<ScheduleAnalytics>('/api/v1/analytics/schedule', {
      method: 'POST',
      body: JSON.stringify({ codes, semester }),
    }),
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export const aiApi = {
  parse: (input: string, save = false) =>
    request<ParseResponse>('/api/v1/ai/parse', {
      method: 'POST',
      body: JSON.stringify({ input, save }),
    }),
  recommendations: (codes: string[], semester: string) =>
    request<RecommendationResponse>('/api/v1/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify({ codes, semester }),
    }),
}

// ─── Health ──────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<{ status: string; version: string; ai: string }>('/health'),
}

export { ApiError }
