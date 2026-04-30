'use strict';
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
  }
}
class NotFoundError extends AppError {
  constructor(resource = 'Resource') { super(resource + ' not found', 404); }
}
module.exports = { AppError, NotFoundError };
