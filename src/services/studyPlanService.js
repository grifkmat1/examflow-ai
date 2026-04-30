'use strict';
const StudyPlanService = {
  generatePlan(exams, opts = {}) {
    if (!exams || !exams.length) return { message: 'No exams provided', sessions: [], aiGenerated: false };
    const dailyHours     = opts.dailyHours     || 6;
    const startDaysAhead = opts.startDaysAhead || 14;
    const sorted = [...exams].sort((a,b) => new Date(a.start_time) - new Date(b.start_time));
    const weights = sorted.map((exam, idx) => ({ exam, weight: (exam.difficulty||3)*(sorted.length-idx) }));
    const totalWeight = weights.reduce((s,w)=>s+w.weight,0);
    const courseAllocation = weights.map(({exam, weight}, idx) => ({
      courseCode: exam.course_code, courseTitle: exam.course_title, difficulty: exam.difficulty||3,
      totalAllocatedHours: parseFloat(((weight/totalWeight)*dailyHours*startDaysAhead).toFixed(1)),
      priorityRank: idx+1,
    }));
    return {
      planStart: new Date().toISOString().split('T')[0],
      planEnd: sorted[sorted.length-1]?.start_time?.split('T')[0],
      totalStudyHours: dailyHours * startDaysAhead,
      aiGenerated: false,
      courseAllocation,
      dailySessions: [],
      generalAdvice: ['For AI-powered daily sessions, use POST /api/v1/ai/study-plan.', 'Study in focused blocks of 25-50 minutes with short breaks.'],
    };
  },
};
module.exports = StudyPlanService;
