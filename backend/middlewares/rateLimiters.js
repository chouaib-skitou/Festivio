const { rateLimit } = require('express-rate-limit');
const { config } = require('../config/env');

const createLimiter = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message },
  });

const apiLimiter = createLimiter(
  config.rateLimitWindowMs,
  config.rateLimitMax,
  'Too many requests. Please try again later.'
);

const authLimiter = createLimiter(
  config.authRateLimitWindowMs,
  config.authRateLimitMax,
  'Too many authentication attempts. Please try again later.'
);

module.exports = { apiLimiter, authLimiter };
