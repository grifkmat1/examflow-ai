'use strict';
const logger = require('../utils/logger');
const requestLogger = (req, res, next) => {
  logger.info(req.method + ' ' + req.path, { ip: req.ip });
  next();
};
module.exports = { requestLogger };
