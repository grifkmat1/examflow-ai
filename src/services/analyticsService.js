'use strict';
const AnalyticsService = {
  analyzeSchedule(exams) {
    if (!exams || !exams.length) return { message: 'No exams to analyze', exams: [] };
    const sorted  = [...exams].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    const spacing  = this._computeSpacing(sorted);
    const workload = this._computeWorkloadScore(sorted);
    const stress   = this._computeStressScore(sorted, spacing);
    return { examCount: sorted.length, spacing, workload, stressScore: stress, recommendations: this._generateRecommendations(spacing, stress) };
  },
  _computeSpacing(sorted) {
    if (sorted.length < 2) return { gaps: [], hasBackToBack: false };
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) {
      const gapHours = Math.max(0, (new Date(sorted[i].start_time) - new Date(sorted[i-1].end_time)) / 3600000);
      gaps.push({ afterExam: sorted[i-1].course_code, beforeExam: sorted[i].course_code, gapHours: parseFloat(gapHours.toFixed(2)), rating: gapHours < 3 ? 'CRITICAL' : gapHours < 24 ? 'TIGHT' : gapHours < 48 ? 'FAIR' : 'GOOD' });
    }
    return { gaps, averageGapHours: parseFloat((gaps.reduce((s,g)=>s+g.gapHours,0)/gaps.length).toFixed(2)), minimumGapHours: parseFloat(Math.min(...gaps.map(g=>g.gapHours)).toFixed(2)), hasBackToBack: gaps.some(g=>g.gapHours<24) };
  },
  _computeWorkloadScore(sorted) {
    if (!sorted.length) return { score: 0, level: 'NONE' };
    const avgDiff = sorted.reduce((s,e)=>s+(e.difficulty||3),0)/sorted.length;
    const score = Math.min(100, Math.round(sorted.length*15 + avgDiff*8));
    return { score, level: score<25?'LOW':score<50?'MODERATE':score<75?'HIGH':'EXTREME', avgDifficulty: parseFloat(avgDiff.toFixed(2)) };
  },
  _computeStressScore(sorted, spacing) {
    const workloadScore = this._computeWorkloadScore(sorted).score;
    const gapPenalty = (spacing.minimumGapHours||72) < 24 ? 30 : 0;
    const score = Math.min(100, Math.round(workloadScore*0.7 + gapPenalty));
    return { score, level: score<30?'LOW':score<55?'MODERATE':score<80?'HIGH':'SEVERE' };
  },
  _generateRecommendations(spacing, stress) {
    const recs = [];
    if (spacing.hasBackToBack) recs.push({ priority: 'HIGH', message: 'Back-to-back exams detected. Focus on sleep and high-yield review only.' });
    if (stress.level === 'HIGH' || stress.level === 'SEVERE') recs.push({ priority: 'HIGH', message: 'High stress load detected. Consider starting preparation earlier.' });
    if (!recs.length) recs.push({ priority: 'LOW', message: 'Your schedule looks manageable. Keep a consistent study routine.' });
    return recs;
  },
};
module.exports = AnalyticsService;
