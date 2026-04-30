# ExamFlow AI Endpoints — Example Responses

## POST /api/v1/ai/study-plan

### Request
```bash
curl -X POST http://localhost:3000/api/v1/ai/study-plan \
  -H "Content-Type: application/json" \
  -d '{
    "codes": ["CS301", "MATH201", "CS401"],
    "semester": "SPRING2025",
    "dailyHours": 6,
    "weakSubjects": ["MATH201"],
    "startDate": "2025-05-01"
  }'
```

### Response
```json
{
  "success": true,
  "data": {
    "planStart": "2025-05-01",
    "planEnd": "2025-05-19",
    "totalStudyHours": 114,
    "aiGenerated": true,
    "courseAllocation": [
      {
        "courseCode": "CS401",
        "courseTitle": "Machine Learning",
        "difficulty": 5,
        "totalAllocatedHours": 42,
        "priorityRank": 1,
        "focusAreas": ["Supervised learning", "Neural networks", "Model evaluation"],
        "studyTips": ["Implement algorithms from scratch", "Use spaced repetition for math derivations"]
      }
    ],
    "dailySessions": [
      {
        "date": "2025-05-01",
        "dayOfWeek": "Thursday",
        "totalHours": 6,
        "sessions": [
          {
            "courseCode": "CS401",
            "topic": "Linear Regression and Gradient Descent",
            "durationMinutes": 120,
            "technique": "Active recall + implementation",
            "notes": "Implement gradient descent from scratch"
          }
        ]
      }
    ],
    "generalAdvice": ["Take a 10-minute break every 50 minutes", "Sleep at least 7 hours"],
    "weeklyMilestones": [
      { "week": 1, "goal": "Cover all CS401 supervised learning algorithms" }
    ]
  }
}
```

---

## POST /api/v1/ai/recommendations

### Request
```bash
curl -X POST http://localhost:3000/api/v1/ai/recommendations \
  -H "Content-Type: application/json" \
  -d '{"codes": ["CS301", "MATH201", "CS401", "PHYS301"], "semester": "SPRING2025"}'
```

### Response
```json
{
  "success": true,
  "data": {
    "aiGenerated": true,
    "overallRiskLevel": "HIGH",
    "riskFactors": [
      {
        "factor": "High-difficulty cluster",
        "severity": "HIGH",
        "detail": "CS401 and PHYS301 fall within 6 days of each other"
      }
    ],
    "scheduleOptimisations": [
      {
        "priority": "HIGH",
        "suggestion": "Begin CS401 preparation at least 3 weeks before the exam date.",
        "impact": "Reduces risk of inadequate preparation for the hardest exam."
      }
    ],
    "wellbeingTips": ["Aim for 7-8 hours of sleep", "Light exercise morning of each exam"],
    "studyStrategyByExam": [
      {
        "courseCode": "CS401",
        "recommendedApproach": "Implementation-first: build each algorithm, then study theory.",
        "keyTopics": ["Gradient descent", "Decision trees", "Neural network layers"],
        "timeAllocationPercent": 37
      }
    ],
    "summary": "Your schedule carries HIGH risk. Start CS401 and PHYS301 preparation immediately."
  }
}
```

---

## POST /api/v1/ai/parse

### Request
```bash
curl -X POST http://localhost:3000/api/v1/ai/parse \
  -H "Content-Type: application/json" \
  -d '{"input": "CS301 final exam on December 15th at 9am in Room 204"}'
```

### Response
```json
{
  "success": true,
  "data": {
    "parsed": {
      "course_code": "CS301",
      "section": null,
      "course_title": "Computer Science 301",
      "exam_type": "FINAL",
      "start_time": "2025-12-15T09:00:00-05:00",
      "end_time": "2025-12-15T12:00:00-05:00",
      "building": null,
      "room": "204",
      "semester": "FALL2025",
      "difficulty": 3,
      "confidence": 0.88,
      "notes": "Duration inferred as 3 hours (standard FINAL).",
      "aiGenerated": true
    }
  }
}
```

---

## POST /api/v1/ai/study-plan (streaming)

### Request
```bash
curl -N -X POST http://localhost:3000/api/v1/ai/study-plan \
  -H "Content-Type: application/json" \
  -d '{"codes": ["CS301"], "semester": "SPRING2025", "stream": true}'
```

### Response (Server-Sent Events)
```
data: {"text":"# CS301 Data Structures Study Plan\n\n"}
data: {"text":"## Overview\nYou have 11 days until your exam..."}
data: [DONE]
```
