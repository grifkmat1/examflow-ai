'use strict';
const ConflictService = {
  findAllConflicts(exams) {
    const conflicts = [];
    for (let i = 0; i < exams.length; i++) {
      for (let j = i+1; j < exams.length; j++) {
        const a = exams[i], b = exams[j];
        const aS = new Date(a.start_time), aE = new Date(a.end_time), bS = new Date(b.start_time), bE = new Date(b.end_time);
        if (aS < bE && bS < aE) {
          const overlapMins = Math.round((Math.min(aE,bE) - Math.max(aS,bS)) / 60000);
          conflicts.push({ type: 'TIME_CONFLICT', severity: overlapMins>=60?'HIGH':'MEDIUM', examA: { id: a.id, courseCode: a.course_code, startTime: a.start_time }, examB: { id: b.id, courseCode: b.course_code, startTime: b.start_time }, overlapMinutes: overlapMins, message: a.course_code + ' and ' + b.course_code + ' overlap by ' + overlapMins + ' minute(s)' });
        }
      }
    }
    return { hasConflicts: conflicts.length > 0, conflictCount: conflicts.length, conflicts };
  },
};
module.exports = ConflictService;
