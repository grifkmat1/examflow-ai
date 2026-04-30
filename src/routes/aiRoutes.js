'use strict';
const express      = require('express');
const { body }     = require('express-validator');
const AIController = require('../controllers/aiController');
const router = express.Router();

router.post('/study-plan', [
  body('dailyHours').optional().isFloat({ min: 0.5, max: 24 }).withMessage('dailyHours must be between 0.5 and 24'),
  body('weakSubjects').optional().isArray().withMessage('weakSubjects must be an array'),
  body('startDate').optional().isISO8601().withMessage('startDate must be ISO 8601'),
  body('stream').optional().isBoolean().withMessage('stream must be boolean'),
], AIController.generateStudyPlan);

router.post('/recommendations', [
  body('codes').optional().isArray().withMessage('codes must be an array'),
  body('semester').optional().isString().withMessage('semester must be a string'),
], AIController.generateRecommendations);

router.post('/parse', [
  body('input').notEmpty().withMessage('"input" is required').isString().isLength({ min: 5, max: 1000 }),
  body('save').optional().isBoolean().withMessage('"save" must be boolean'),
], AIController.parseNaturalLanguage);

module.exports = router;
