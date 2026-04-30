'use strict';
const express = require('express');
const { body } = require('express-validator');
const ExamController = require('../controllers/examController');
const router = express.Router();

router.get('/', ExamController.getExams);
router.get('/:id', ExamController.getExamById);
router.post('/', [
  body('course_code').notEmpty().withMessage('course_code is required'),
  body('course_title').notEmpty().withMessage('course_title is required'),
  body('exam_type').isIn(['FINAL','MIDTERM','QUIZ']).withMessage('exam_type must be FINAL, MIDTERM, or QUIZ'),
  body('start_time').isISO8601().withMessage('start_time must be ISO 8601'),
  body('end_time').isISO8601().withMessage('end_time must be ISO 8601'),
  body('semester').notEmpty().withMessage('semester is required'),
], ExamController.createExam);
router.delete('/:id', ExamController.deleteExam);
router.post('/detect-conflicts', ExamController.detectConflicts);

module.exports = router;
