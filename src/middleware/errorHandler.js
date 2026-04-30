'use strict';
const logger = require('../utils/logger');
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  logger.error('[ErrorHandler]', { message: err.message, status, path: req.path });
  res.status(status).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
module.exports = { errorHandler };
