'use strict';
require('dotenv').config();
const app    = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info('ExamFlow v2 running on port ' + PORT);
  logger.info('AI endpoints: ' + (process.env.CLAUDE_API_KEY ? 'enabled' : 'disabled (set CLAUDE_API_KEY)'));
  logger.info('Health: http://localhost:' + PORT + '/health');
});
