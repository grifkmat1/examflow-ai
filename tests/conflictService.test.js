'use strict';
const ConflictService = require('../src/services/conflictService');
const makeExam = (code, start, end) => ({ id: code, course_code: code, start_time: start, end_time: end });

describe('ConflictService', () => {
  it('returns no conflicts for non-overlapping exams', () => {
    const result = ConflictService.findAllConflicts([
      makeExam('CS301',   '2025-05-12T09:00:00Z', '2025-05-12T12:00:00Z'),
      makeExam('MATH201', '2025-05-14T09:00:00Z', '2025-05-14T11:00:00Z'),
    ]);
    expect(result.hasConflicts).toBe(false);
    expect(result.conflictCount).toBe(0);
  });
  it('detects a direct overlap', () => {
    const result = ConflictService.findAllConflicts([
      makeExam('CS301',  '2025-05-12T09:00:00Z', '2025-05-12T12:00:00Z'),
      makeExam('ENG102', '2025-05-12T11:00:00Z', '2025-05-12T13:00:00Z'),
    ]);
    expect(result.hasConflicts).toBe(true);
    expect(result.conflicts[0].overlapMinutes).toBe(60);
    expect(result.conflicts[0].severity).toBe('HIGH');
  });
  it('handles an empty exam list', () => {
    const result = ConflictService.findAllConflicts([]);
    expect(result.hasConflicts).toBe(false);
  });
});
