'use strict';
const StudyPlanService = require('../services/studyPlanService');
const ExamModel        = require('../models/examModel');
const { AppError }     = require('../utils/errors');

const StudyPlanController = {
  async generateStudyPlan(req, res, next) {
    try {
      const { codes, semester, dailyHours, startDaysAhead } = req.body;
      if (!codes || !codes.length) throw new AppError('"codes" array is required', 400);
      const exams = await ExamModel.findByCourseCodes(codes, semester);
      if (!exams.length) throw new AppError('No exams found', 404);
      const plan = StudyPlanService.generatePlan(exams, { dailyHours: dailyHours||6, startDaysAhead: startDaysAhead||14 });
      res.json({ success: true, data: plan });
    } catch(err) { next(err); }
  },
};
module.exports = StudyPlanController;
