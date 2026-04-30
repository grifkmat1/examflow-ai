'use strict';
const AnalyticsService = require('../services/analyticsService');
const ExamModel        = require('../models/examModel');
const { AppError }     = require('../utils/errors');

const AnalyticsController = {
  async getScheduleAnalytics(req, res, next) {
    try {
      const { codes, semester } = req.body;
      if (!codes || !codes.length) throw new AppError('"codes" array is required', 400);
      const exams = await ExamModel.findByCourseCodes(codes, semester);
      res.json({ success: true, data: AnalyticsService.analyzeSchedule(exams) });
    } catch(err) { next(err); }
  },
  async getWorkloadScore(req, res, next) {
    try {
      const { codes, semester } = req.body;
      if (!codes || !codes.length) throw new AppError('"codes" array is required', 400);
      const exams = await ExamModel.findByCourseCodes(codes, semester);
      res.json({ success: true, data: { workload: AnalyticsService._computeWorkloadScore(exams), examCount: exams.length } });
    } catch(err) { next(err); }
  },
};
module.exports = AnalyticsController;
