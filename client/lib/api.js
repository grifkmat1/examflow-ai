const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json', ...opts.headers }, ...opts })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || res.statusText) }
  return res.json()
}

export const examsApi = {
  getAll: () => req('/api/v1/exams'),
  getById: id => req('/api/v1/exams/' + id),
  create: data => req('/api/v1/exams', { method: 'POST', body: JSON.stringify(data) }),
  delete: id => req('/api/v1/exams/' + id, { method: 'DELETE' }),
  detectConflicts: exams => req('/api/v1/exams/detect-conflicts', { method: 'POST', body: JSON.stringify({ exams }) }),
}

export const studyPlansApi = {
  generate: id => req('/api/v1/study-plans/' + id, { method: 'POST' }),
  stream: async (id, onChunk, onDone) => {
    const res = await fetch(BASE + '/api/v1/study-plans/' + id + '/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
    if (!res.ok) throw new Error('Stream failed')
    const reader = res.body.getReader(); const dec = new TextDecoder(); let full = ''
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      for (const line of dec.decode(value).split('\n').filter(Boolean)) {
        if (!line.startsWith('data: ')) continue
        const d = line.slice(6); if (d === '[DONE]') { onDone?.(full); return }
        try { const p = JSON.parse(d); const t = p.content || p.text || p.chunk || ''; full += t; onChunk?.(t, full) } catch {}
      }
    }
    onDone?.(full)
  }
}

export const analyticsApi = {
  getWorkload: () => req('/api/v1/analytics/workload'),
  getSummary: () => req('/api/v1/analytics/summary'),
}

export const aiApi = {
  parse: text => req('/api/v1/ai/parse', { method: 'POST', body: JSON.stringify({ text }) }),
}

export const healthApi = { check: () => req('/health') }
