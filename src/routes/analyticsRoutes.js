'use strict';
const express = require('express');
const AnalyticsController = require('../controllers/analyticsController');
const router = express.Router();
router.post('/schedule', AnalyticsController.getScheduleAnalytics);
router.post('/workload', AnalyticsController.getWorkloadScore);
module.exports = router;
