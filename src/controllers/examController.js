'use strict';
const ExamService      = require('../services/examService');
const { validationResult } = require('express-validator');
const { AppError }     = require('../utils/errors');

const ExamController = {
  async getExams(req, res, next) { try { const exams = await ExamService.getAllExams(req.query); res.json({ success: true, count: exams.length, data: exams }); } catch(err) { next(err); } },
  async getExamById(req, res, next) { try { const exam = await ExamService.getExamById(req.params.id); res.json({ success: true, data: exam }); } catch(err) { next(err); } },
  async createExam(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) throw new AppError('Validation failed', 400, errors.array());
      const exam = await ExamService.createExam(req.body);
      res.status(201).json({ success: true, data: exam });
    } catch(err) { next(err); }
  },
  async deleteExam(req, res, next) { try { await ExamService.deleteExam(req.params.id); res.json({ success: true }); } catch(err) { next(err); } },
  async detectConflicts(req, res, next) { try { const result = await ExamService.detectConflicts(req.body.codes, req.body.semester); res.json({ success: true, data: result }); } catch(err) { next(err); } },
};
module.exports = ExamController;
