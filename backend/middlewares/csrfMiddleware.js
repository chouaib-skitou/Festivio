const crypto = require('crypto');
const { doubleCsrf } = require('csrf-csrf');
const { config } = require('../config/env');

const CSRF_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const csrfCookieName = config.isProduction
  ? '__Host-festivio.csrf'
  : 'festivio_csrf';

const csrfCookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'strict',
  path: '/',
};

const {
  doubleCsrfProtection,
  generateCsrfToken,
  invalidCsrfTokenError,
} = doubleCsrf({
  getSecret: () => config.csrfSecret,
  getSessionIdentifier: (req) =>
    req.cookies?.[config.csrfSessionCookieName] || 'missing-csrf-session',
  cookieName: csrfCookieName,
  cookieOptions: csrfCookieOptions,
  getCsrfTokenFromRequest: (req) => req.get('x-csrf-token'),
});

const issueCsrfToken = (req, res) => {
  if (!req.cookies?.[config.csrfSessionCookieName]) {
    const sessionIdentifier = crypto.randomBytes(32).toString('hex');
    res.cookie(config.csrfSessionCookieName, sessionIdentifier, {
      ...csrfCookieOptions,
      maxAge: CSRF_SESSION_MAX_AGE_MS,
    });
    req.cookies[config.csrfSessionCookieName] = sessionIdentifier;
  }

  const csrfToken = generateCsrfToken(req, res);
  return res.status(200).json({ csrfToken });
};

const isInvalidCsrfTokenError = (error) => error === invalidCsrfTokenError;

module.exports = {
  doubleCsrfProtection,
  issueCsrfToken,
  isInvalidCsrfTokenError,
};
