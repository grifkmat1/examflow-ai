'use strict';
const { validationResult } = require('express-validator');
const AIService        = require('../services/aiService');
const AnalyticsService = require('../services/analyticsService');
const ExamModel        = require('../models/examModel');
const { AppError }     = require('../utils/errors');
const logger           = require('../utils/logger');

const AIController = {

  async generateStudyPlan(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new AppError('Validation failed', 400, errors.array());
      const { codes, semester, exams: inlineExams, dailyHours = 6, weakSubjects = [], startDate, stream = false } = req.body;
      let exams = inlineExams;
      if (!exams || !exams.length) {
        if (!codes || !codes.length) throw new AppError('Provide either "codes" or "exams"', 400);
        exams = await ExamModel.findByCourseCodes(codes, semester);
      }
      if (!exams.length) throw new AppError('No exams found for the given criteria', 404);
      logger.info('[AIController] study-plan requested', { examCount: exams.length, dailyHours, stream });
      if (stream) return AIService.streamStudyPlan({ exams, dailyHours, weakSubjects, startDate }, res);
      const plan = await AIService.generateStudyPlan({ exams, dailyHours, weakSubjects, startDate });
      return res.json({ success: true, data: plan });
    } catch (err) { next(err); }
  },

  async generateRecommendations(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new AppError('Validation failed', 400, errors.array());
      const { codes, semester, exams: inlineExams } = req.body;
      let exams = inlineExams;
      if (!exams || !exams.length) {
        if (!codes || !codes.length) throw new AppError('Provide either "codes" or "exams"', 400);
        exams = await ExamModel.findByCourseCodes(codes, semester);
      }
      if (!exams.length) throw new AppError('No exams found for the given criteria', 404);
      const analyticsData = AnalyticsService.analyzeSchedule(exams);
      logger.info('[AIController] recommendations requested', { examCount: exams.length });
      const recommendations = await AIService.generateRecommendations({ exams, analyticsData });
      return res.json({ success: true, data: { ...recommendations, analyticsContext: analyticsData } });
    } catch (err) { next(err); }
  },

  async parseNaturalLanguage(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new AppError('Validation failed', 400, errors.array());
      const { input, save = false } = req.body;
      if (!input || !input.trim()) throw new AppError('"input" is required and must be non-empty', 400);
      logger.info('[AIController] parse requested', { inputLength: input.length });
      const parsed = await AIService.parseNaturalLanguageExam(input.trim());
      let savedExam = null;
      if (save && parsed.course_code && parsed.start_time) {
        savedExam = await ExamModel.create(parsed);
        logger.info('[AIController] parsed exam saved', { id: savedExam.id });
      }
      return res.json({ success: true, data: { parsed, ...(savedExam && { saved: savedExam }) } });
    } catch (err) { next(err); }
  },
};
module.exports = AIController;
