const { rateLimit } = require('express-rate-limit');
const { config } = require('../config/env');

const createLimiter = ({ windowMs, limit, message }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message },
  });

const apiLimiter = createLimiter({
  windowMs: config.rateLimitWindowMs,
  limit: config.rateLimitMax,
  message: 'Too many requests. Please try again later.',
});

const authLimiter = createLimiter({
  windowMs: config.authRateLimitWindowMs,
  limit: config.authRateLimitMax,
  message: 'Too many authentication attempts. Please try again later.',
});

const readLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 240,
  message: 'Too many read requests. Please slow down and try again shortly.',
});

const writeLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 60,
  message: 'Too many write requests. Please slow down and try again shortly.',
});

const uploadLimiter = createLimiter({
  windowMs: 60 * 1000,
  limit: 20,
  message: 'Too many upload requests. Please slow down and try again shortly.',
});

module.exports = {
  apiLimiter,
  authLimiter,
  readLimiter,
  uploadLimiter,
  writeLimiter,
};
