'use strict';
const express = require('express');
const StudyPlanController = require('../controllers/studyPlanController');
const router = express.Router();
router.post('/generate', StudyPlanController.generateStudyPlan);
module.exports = router;
