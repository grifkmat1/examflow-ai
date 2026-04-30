'use strict';
const AnalyticsService = require('../src/services/analyticsService');
const makeExam = (code, start, end, difficulty = 3) => ({ course_code: code, start_time: start, end_time: end, difficulty });

describe('AnalyticsService', () => {
  it('returns message for empty exams', () => {
    const r = AnalyticsService.analyzeSchedule([]);
    expect(r.message).toBeDefined();
  });
  it('computes workload score', () => {
    const r = AnalyticsService._computeWorkloadScore([
      makeExam('CS301',   '2025-05-12T09:00:00Z', '2025-05-12T12:00:00Z', 5),
      makeExam('MATH201', '2025-05-14T09:00:00Z', '2025-05-14T11:00:00Z', 3),
    ]);
    expect(r.score).toBeGreaterThan(0);
    expect(['LOW','MODERATE','HIGH','EXTREME']).toContain(r.level);
  });
  it('detects back-to-back exams', () => {
    const r = AnalyticsService.analyzeSchedule([
      makeExam('A', '2025-05-12T09:00:00Z', '2025-05-12T12:00:00Z'),
      makeExam('B', '2025-05-12T14:00:00Z', '2025-05-12T16:00:00Z'),
    ]);
    expect(r.spacing.hasBackToBack).toBe(true);
  });
});
