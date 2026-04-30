'use strict';
const ExamModel       = require('../models/examModel');
const ConflictService = require('./conflictService');
const { NotFoundError, AppError } = require('../utils/errors');

const ExamService = {
  async getAllExams(filters = {}) { return ExamModel.findAll(filters); },
  async getExamById(id) {
    const exam = await ExamModel.findById(id);
    if (!exam) throw new NotFoundError('Exam');
    return exam;
  },
  async createExam(data) {
    const conflicts = await ExamModel.findConflicting(data.start_time, data.end_time, null);
    if (conflicts.length) throw new AppError('New exam conflicts with ' + conflicts.length + ' existing exam(s)', 409, conflicts.map(c=>({id:c.id,course_code:c.course_code})));
    return ExamModel.create(data);
  },
  async deleteExam(id) {
    const deleted = await ExamModel.delete(id);
    if (!deleted) throw new NotFoundError('Exam');
    return { deleted: true, id };
  },
  async detectConflicts(codes, semester) {
    const exams = await ExamModel.findByCourseCodes(codes, semester);
    return ConflictService.findAllConflicts(exams);
  },
};
module.exports = ExamService;
