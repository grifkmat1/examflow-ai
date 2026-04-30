'use strict';
const express       = require('express');
const helmet        = require('helmet');
const cors          = require('cors');
const morgan        = require('morgan');
const examRoutes      = require('./routes/examRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const aiRoutes        = require('./routes/aiRoutes');
const { errorHandler }  = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');
const { rateLimiter }   = require('./middleware/rateLimiter');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3001'],
  credentials: true,
}));
app.use(express.json({ limit: '50kb' }));
app.use(morgan('combined'));
app.use(requestLogger);
app.use('/api/', rateLimiter);

app.get('/health', (req, res) =>
  res.json({
    status:  'ok',
    service: 'ExamFlow API',
    version: '2.0.0',
    ai:      process.env.CLAUDE_API_KEY ? 'enabled' : 'disabled (no key)',
  })
);

app.use('/api/v1/exams',       examRoutes);
app.use('/api/v1/analytics',   analyticsRoutes);
app.use('/api/v1/study-plans', studyPlanRoutes);
app.use('/api/v1/ai',          aiRoutes);
app.use(errorHandler);

module.exports = app;
