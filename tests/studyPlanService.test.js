'use strict';
const StudyPlanService = require('../src/services/studyPlanService');

describe('StudyPlanService', () => {
  it('returns message for no exams', () => {
    const r = StudyPlanService.generatePlan([]);
    expect(r.sessions).toEqual([]);
  });
  it('allocates more hours to higher difficulty exams', () => {
    const exams = [
      { course_code: 'EASY', course_title: 'Easy Course', difficulty: 1, start_time: '2025-05-20T09:00:00Z' },
      { course_code: 'HARD', course_title: 'Hard Course', difficulty: 5, start_time: '2025-05-15T09:00:00Z' },
    ];
    const plan = StudyPlanService.generatePlan(exams, { dailyHours: 6, startDaysAhead: 14 });
    const easyH = plan.courseAllocation.find(c => c.courseCode === 'EASY').totalAllocatedHours;
    const hardH = plan.courseAllocation.find(c => c.courseCode === 'HARD').totalAllocatedHours;
    expect(hardH).toBeGreaterThan(easyH);
  });
  it('respects dailyHours parameter', () => {
    const exams = [{ course_code: 'CS301', course_title: 'Data Structures', difficulty: 3, start_time: '2025-05-20T09:00:00Z' }];
    const plan = StudyPlanService.generatePlan(exams, { dailyHours: 4, startDaysAhead: 7 });
    expect(plan.totalStudyHours).toBe(28);
  });
});
