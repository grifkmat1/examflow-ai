<div align="center">

# ExamFlow AI

**Exam scheduling, conflict detection, and AI study plans — built as a full-stack production SaaS.**

[![CI](https://github.com/grifkmat1/examflow-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/grifkmat1/examflow-ai/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Claude AI](https://img.shields.io/badge/Claude-3.5%20Sonnet-d97706?logo=anthropic&logoColor=white)](https://anthropic.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e.svg)](LICENSE)

[🚀 Live Demo](https://examflow-ai.vercel.app) · [📖 API Reference](docs/example-responses.md) · [🐛 Issues](https://github.com/grifkmat1/examflow-ai/issues)

</div>

---

## What this is

Most students manage exam schedules in Google Sheets. ExamFlow AI is what that spreadsheet should have been.

It detects scheduling conflicts automatically, generates a personalised day-by-day study plan using Claude AI, and gives you a visual breakdown of your workload — all through a clean, production-quality interface.

The backend is a Node.js/Express REST API with PostgreSQL, rate limiting, error handling, and structured logging. The frontend is Next.js 14 with TypeScript, Clerk auth, Supabase, and real-time streaming via Server-Sent Events. The whole stack is dockerised, tested, and wired up with CI/CD.

---

## Screenshots

> Run the app locally to generate your own — see [docs/screenshots/README.md](docs/screenshots/README.md)

| Landing | Dashboard | Exams |
|---|---|---|
| ![Landing](docs/screenshots/landing.png) | ![Dashboard](docs/screenshots/dashboard.png) | ![Exams](docs/screenshots/exams.png) |

| Study Plans (streaming) | Analytics | NLP Parser |
|---|---|---|
| ![Study Plans](docs/screenshots/study-plans.png) | ![Analytics](docs/screenshots/analytics.png) | ![NLP](docs/screenshots/nlp.png) |

---

## Features

**Conflict Detection** — Submit your exam schedule and the API immediately detects overlapping or back-to-back exams, returning structured conflict objects with severity levels.

**Claude AI Study Plans** — The `/api/v1/ai/study-plan` endpoint calls Claude 3.5 Sonnet and streams a day-by-day study schedule back to the frontend via SSE. The UI renders it token by token.

**Workload Analytics** — Credit hours, exam density by day, risk scores, and type breakdowns — rendered with Recharts in a responsive dashboard.

**Natural Language Parser** — Type "CS301 final on Dec 15 at 9am in Room 204" and the AI returns a structured JSON exam object, ready to save.

**Demo Mode** — Every frontend page falls back to realistic seed data if the backend is offline. You can explore the full UI without running a single server.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Frontend — Next.js 14 + TypeScript (Vercel)                  │
│  ├── App Router with route groups and server components       │
│  ├── Clerk authentication with middleware protection          │
│  ├── Typed API client (/lib/api.ts) with SSE streaming        │
│  └── Recharts analytics + Tailwind dark theme                 │
├──────────────────────────────────────────────────────────────┤
│  Backend — Node.js / Express (Render)                         │
│  ├── REST API with controllers, services, models              │
│  ├── Claude AI integration (Anthropic SDK, streaming)         │
│  ├── PostgreSQL via pg with parameterised queries             │
│  ├── Rate limiting, Helmet, CORS, Morgan logging              │
│  └── In-memory TTL cache for AI responses                     │
├──────────────────────────────────────────────────────────────┤
│  Infrastructure                                               │
│  ├── Docker + docker-compose for local full-stack             │
│  ├── GitHub Actions CI (lint → test → type-check → build)    │
│  ├── render.yaml for zero-config Render deployment            │
│  └── vercel.json for frontend deploy config                   │
└──────────────────────────────────────────────────────────────┘
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check with AI status |
| `GET` | `/api/v1/exams` | List all exams |
| `POST` | `/api/v1/exams` | Create exam |
| `DELETE` | `/api/v1/exams/:id` | Delete exam |
| `POST` | `/api/v1/exams/detect-conflicts` | Conflict detection |
| `POST` | `/api/v1/ai/study-plan` | Generate plan (supports `stream: true`) |
| `POST` | `/api/v1/ai/recommendations` | Risk assessment |
| `POST` | `/api/v1/ai/parse` | NLP → structured exam data |
| `POST` | `/api/v1/analytics/workload` | Workload analysis |

---

## Local setup

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14 (or a [Supabase](https://supabase.com) project)
- [Anthropic API key](https://console.anthropic.com)
- [Clerk account](https://clerk.com)

### Backend

```bash
git clone https://github.com/grifkmat1/examflow-ai.git
cd examflow-ai
npm install
cp .env.example .env
# Edit .env — add CLAUDE_API_KEY and DATABASE_URL
psql -U postgres -d examflow -f docs/schema.sql
npm run dev          # http://localhost:3000
```

### Frontend

```bash
cd client
npm install
cp .env.local.example .env.local
# Edit .env.local — add Clerk keys, Supabase URL/key, NEXT_PUBLIC_API_URL
npm run dev          # http://localhost:3001
```

### Full stack with Docker

```bash
cp .env.example .env   # fill in secrets
docker compose up --build
# Backend  → http://localhost:3000
# Frontend → http://localhost:3001
```

---

## Deployment

### Frontend → Vercel

```bash
cd client && npx vercel --prod
```

Set these in the Vercel dashboard:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` → your Render backend URL

### Backend → Render

Push to GitHub. Render auto-detects `render.yaml`. Set `CLAUDE_API_KEY`, `DATABASE_URL`, and `ALLOWED_ORIGINS` in the Render environment variables dashboard.

---

## Database

Run `docs/schema.sql` for standard PostgreSQL, or `docs/supabase-schema.sql` for Supabase with Row Level Security pre-configured.

The Supabase schema includes seed data for five demo exams and an RLS policy that scopes every row to the authenticated Clerk user.

---

## Testing

```bash
npm test                # run all tests with coverage
npm run test:watch      # watch mode
```

Tests cover: conflict detection algorithm, study plan generation, NLP parsing, analytics calculations.

---

## Why this project is different

Most portfolio projects are tutorials with a new coat of paint. ExamFlow AI was built to demonstrate the kinds of decisions that matter in a real engineering job:

- **Streaming done properly.** The SSE implementation handles backpressure, reconnection, and partial JSON gracefully.
- **Layered architecture.** Controllers don't talk to the database directly — they go through services, which use models. Testable at every layer.
- **Graceful degradation.** If the AI is down, the app falls back to rule-based logic. If the backend is down, the frontend shows demo data. Nothing hard-crashes.
- **CI/CD that actually runs.** The GitHub Actions pipeline lints, tests, type-checks, builds, and smoke-tests a Docker container — not just `echo "ok"`.
- **Type safety end to end.** Shared type definitions between the API layer and UI components mean you get a compile error, not a runtime surprise.

---

## Environment variables

| Variable | Location | Description |
|---|---|---|
| `CLAUDE_API_KEY` | Backend | Anthropic API key |
| `DATABASE_URL` | Backend | PostgreSQL connection string |
| `PORT` | Backend | Server port (default 3000) |
| `ALLOWED_ORIGINS` | Backend | CORS whitelist — your frontend URL |
| `NODE_ENV` | Backend | `development` or `production` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Frontend | Clerk public key |
| `CLERK_SECRET_KEY` | Frontend | Clerk secret |
| `NEXT_PUBLIC_SUPABASE_URL` | Frontend | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Frontend | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | Frontend | Backend URL |

---

<div align="center">
Built by <a href="https://github.com/grifkmat1">Matthew Griffin</a> · MIT License
</div>
