'use strict';
const store = new Map();
const WINDOW_MS    = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60000;
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX, 10)       || 100;

const rateLimiter = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  store.set(key, (store.get(key) || []).filter(ts => ts > windowStart));
  const requests = store.get(key);
  if (requests.length >= MAX_REQUESTS) {
    return res.status(429).json({ success: false, error: 'Too many requests. Please try again later.', retryAfterMs: WINDOW_MS });
  }
  requests.push(now);
  next();
};
module.exports = { rateLimiter };
