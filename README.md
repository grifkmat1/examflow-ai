# ExamFlow v2 — AI-Powered Exam Scheduling Platform

ExamFlow is a production-ready Node.js/Express REST API that combines rule-based exam scheduling logic with Claude AI to generate personalised study plans, risk assessments, and intelligent scheduling recommendations.

---

## What's New in v2

| Feature | v1 | v2 |
|---|---|---|
| Study plan generation | Rule-based only | **AI-powered (Claude)** with rule-based fallback |
| Schedule recommendations | Simple rule checks | **AI risk analysis + optimisation** |
| Exam data entry | Manual JSON only | **Natural language to structured data** |
| Streaming responses | No | **Yes — Server-sent events** |
| Response caching | No | **Yes — In-memory TTL cache** |

---

## Project Structure

```
examflow/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/database.js
│   ├── controllers/
│   │   ├── aiController.js        ← NEW
│   │   ├── analyticsController.js
│   │   ├── examController.js
│   │   └── studyPlanController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   └── requestLogger.js
│   ├── models/examModel.js
│   ├── routes/
│   │   ├── aiRoutes.js            ← NEW
│   │   ├── analyticsRoutes.js
│   │   ├── examRoutes.js
│   │   └── studyPlanRoutes.js
│   ├── services/
│   │   ├── aiService.js           ← NEW (Claude integration)
│   │   ├── analyticsService.js
│   │   ├── conflictService.js
│   │   ├── examService.js
│   │   └── studyPlanService.js
│   └── utils/
│       ├── errors.js
│       └── logger.js
├── docs/
│   ├── schema.sql
│   └── example-responses.md
├── tests/
│   ├── aiService.test.js          ← NEW
│   ├── analyticsService.test.js
│   ├── conflictService.test.js
│   └── studyPlanService.test.js
├── .env.example
├── .gitignore
└── package.json
```

---

## Prerequisites

- **Node.js** >= 18
- **PostgreSQL** >= 14
- **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

## Setup and Run

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your `CLAUDE_API_KEY` and database credentials.

### 3. Set up the database

```bash
psql -U your_user -d examflow -f docs/schema.sql
```

### 4. Start the server

```bash
npm run dev   # development with auto-reload
npm start     # production
```

### 5. Verify

```bash
curl http://localhost:3000/health
```

---

## API Reference

### Existing endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/exams | List all exams |
| GET | /api/v1/exams/:id | Get exam by ID |
| POST | /api/v1/exams | Create exam |
| DELETE | /api/v1/exams/:id | Delete exam |
| POST | /api/v1/exams/detect-conflicts | Find time conflicts |
| POST | /api/v1/analytics/schedule | Schedule analytics |
| POST | /api/v1/analytics/workload | Workload score |
| POST | /api/v1/study-plans/generate | Rule-based study plan |

### New AI endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/ai/study-plan | AI-generated day-by-day study plan |
| POST | /api/v1/ai/recommendations | Risk assessment and optimisation tips |
| POST | /api/v1/ai/parse | Natural language to structured exam data |

---

## Quick API Examples

### Generate an AI study plan

```bash
curl -X POST http://localhost:3000/api/v1/ai/study-plan \
  -H "Content-Type: application/json" \
  -d '{
    "codes": ["CS301", "MATH201"],
    "semester": "SPRING2025",
    "dailyHours": 6,
    "weakSubjects": ["MATH201"]
  }'
```

### Stream a study plan (Server-Sent Events)

```bash
curl -N -X POST http://localhost:3000/api/v1/ai/study-plan \
  -H "Content-Type: application/json" \
  -d '{"codes": ["CS301"], "semester": "SPRING2025", "stream": true}'
```

### Get AI recommendations

```bash
curl -X POST http://localhost:3000/api/v1/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"codes": ["CS301", "MATH201", "CS401"], "semester": "SPRING2025"}'
```

### Parse natural language into exam data

```bash
curl -X POST http://localhost:3000/api/v1/ai/parse \
  -H "Content-Type: application/json" \
  -d '{"input": "CS301 final on December 15 at 9am in Room 204", "save": false}'
```

See [docs/example-responses.md](docs/example-responses.md) for full request/response examples.

---

## Running Tests

```bash
npm test              # all tests with coverage
npm run test:watch    # watch mode
```

---

## Bugs Fixed from v1

| File | Bug | Fix |
|------|-----|-----|
| studyPlanController.js | roq.body typo | req.body |
| analyticsController.js | roq.body typo | req.body |
| studyPlanService.js | svortedDaysAhead undefined | startDaysAhead |
| examModel.js | Broken SQL queries | Proper parameterised queries |

---

## License

MIT
