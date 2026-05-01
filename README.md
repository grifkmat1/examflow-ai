<div align="center">

<img src="https://img.shields.io/badge/ExamFlow-AI-emerald?style=for-the-badge&logo=anthropic&logoColor=white" alt="ExamFlow AI" />

# ExamFlow AI

**Production-ready AI SaaS for intelligent exam scheduling**

[![CI](https://github.com/grifkmat1/examflow-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/grifkmat1/examflow-ai/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🚀 Live Demo](https://examflow-ai.vercel.app) · [📖 API Docs](docs/example-responses.md) · [🐛 Report Bug](issues)

</div>

---

## 🧠 What it does

ExamFlow AI is a full-stack SaaS platform that solves the real problem of academic exam scheduling — detecting conflicts, generating AI study plans, and analysing workload — all in a clean, modern interface powered by Claude AI.

| Problem | ExamFlow Solution |
|---|---|
| Students don't notice scheduling conflicts | ⚡ **Automatic conflict detection** across all exams |
| Generic study advice doesn't help | 🧠 **Claude AI generates personalised day-by-day plans** |
| Hard to see exam load at a glance | 📊 **Visual analytics** — credit hours, risk scores, daily density |
| Manual exam data entry is tedious | 💬 **NLP parser** — describe in English, AI structures it |

---

## 📸 Screenshots

> _Add screenshots to `docs/screenshots/` after first run_

| Dashboard | Exams | Study Plans |
|---|---|---|
| `docs/screenshots/dashboard.png` | `docs/screenshots/exams.png` | `docs/screenshots/study-plans.png` |

| Analytics | NLP Parser | Landing Page |
|---|---|---|
| `docs/screenshots/analytics.png` | `docs/screenshots/nlp.png` | `docs/screenshots/landing.png` |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ExamFlow AI                                  │
├────────────────────────┬────────────────────────────────────────────┤
│   Frontend (Vercel)     │   Backend (Render)                         │
│   Next.js 14 + TS       │   Node.js + Express                        │
│   Tailwind CSS          │   PostgreSQL (Supabase)                    │
│   Clerk Auth            │   Claude AI (Anthropic SDK)                │
│   Recharts              │   Docker + render.yaml                     │
├────────────────────────┴────────────────────────────────────────────┤
│                    API Layer                                          │
│  GET  /api/v1/exams                List all exams                    │
│  POST /api/v1/exams                Create exam                       │
│  POST /api/v1/exams/detect-        Conflict detection                │
│  POST /api/v1/ai/study-plan        AI study plan (streaming)         │
│  POST /api/v1/ai/recommendations   Risk assessment                   │
│  POST /api/v1/ai/parse             NLP → structured exam data        │
│  POST /api/v1/analytics/workload   Workload score                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Setup

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14 (or Supabase account)
- Anthropic API key ([get one](https://console.anthropic.com))
- Clerk account ([get one](https://clerk.com))

### 1. Backend

```bash
git clone https://github.com/grifkmat1/examflow-ai.git
cd examflow-ai
npm install
cp .env.example .env
# Fill in: CLAUDE_API_KEY, DATABASE_URL
psql -U postgres -d examflow -f docs/schema.sql  # or use Supabase SQL editor
npm run dev        # → http://localhost:3000
```

### 2. Frontend

```bash
cd client
npm install
cp .env.local.example .env.local
# Fill in: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY,
#          NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#          NEXT_PUBLIC_API_URL=http://localhost:3000
npm run dev        # → http://localhost:3001
```

### 3. Docker (full stack)

```bash
cp .env.example .env  # fill in secrets
docker compose up --build
# Backend  → http://localhost:3000
# Frontend → http://localhost:3001
```

---

## 🚀 Deployment

### Frontend → Vercel

```bash
cd client
npx vercel --prod
# Set env vars in Vercel dashboard (see client/.env.local.example)
```

### Backend → Render

1. Push to GitHub
2. Connect repo at [render.com](https://render.com)
3. Render auto-detects `render.yaml`
4. Set `CLAUDE_API_KEY`, `DATABASE_URL`, `ALLOWED_ORIGINS` in Render dashboard

---

## 💼 Why this project is impressive

- **Real AI integration** — not a wrapper, uses Claude AI streaming SSE properly
- **Production architecture** — rate limiting, error handling, request logging, health checks
- **TypeScript end-to-end** — fully typed frontend with strict mode
- **Conflict detection algorithm** — O(n²) overlap detection with severity classification
- **CI/CD pipeline** — GitHub Actions tests backend + builds frontend + Docker smoke test
- **Security** — Helmet.js, CORS, rate limiting, input validation, RLS on Supabase
- **Demo mode** — frontend works standalone with demo data even when backend is offline

---

## 🧪 Testing

```bash
npm test              # all backend tests with coverage
npm run test:watch    # watch mode
```

---

## 📂 Project Structure

```
examflow-ai/
├── src/                      # Express backend
│   ├── controllers/          # Route controllers
│   ├── routes/               # API routes
│   ├── services/             # Business logic + AI
│   ├── middleware/           # Auth, rate limiting, errors
│   └── models/               # DB models
├── client/                   # Next.js 14 frontend
│   ├── app/                  # App Router pages
│   │   ├── (app)/            # Protected dashboard routes
│   │   │   ├── dashboard/
│   │   │   ├── exams/
│   │   │   ├── study-plans/
│   │   │   ├── analytics/
│   │   │   └── nlp/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── components/
│   │   ├── layout/           # AppShell sidebar
│   │   └── ui/               # Reusable components
│   └── lib/
│       ├── api.ts            # Typed API client
│       └── types.ts          # Shared TypeScript types
├── docs/
│   ├── schema.sql            # PostgreSQL schema
│   └── supabase-schema.sql   # Supabase-specific schema + RLS
├── tests/                    # Jest test suite
├── Dockerfile
├── docker-compose.yml
├── render.yaml
└── .github/workflows/ci.yml
```

---

## 🔑 Environment Variables

| Variable | Where | Description |
|---|---|---|
| `CLAUDE_API_KEY` | Backend | Anthropic API key |
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `ALLOWED_ORIGINS` | Backend | CORS whitelist (frontend URL) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Frontend | Clerk public key |
| `CLERK_SECRET_KEY` | Frontend | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend URL |

---

<div align="center">

Built by [Matthew Griffin](https://github.com/grifkmat1) · ExamFlow AI v2.0 · MIT License

</div>
