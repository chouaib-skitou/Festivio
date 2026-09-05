const dotenv = require('dotenv');

dotenv.config();

const stripTrailingSlash = (value) => value?.replace(/\/+$/, '');

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
};

const nodeEnv = process.env.NODE_ENV || process.env.ENV || 'development';
const port = parseInteger(process.env.PORT, 5000);
const frontendUrl = stripTrailingSlash(
  process.env.FRONTEND_URL || 'http://localhost:3000'
);
const backendUrl = stripTrailingSlash(
  process.env.BACKEND_URL || `http://localhost:${port}`
);
const corsOrigins = (process.env.CORS_ORIGINS || frontendUrl)
  .split(',')
  .map((origin) => stripTrailingSlash(origin.trim()))
  .filter(Boolean);

const config = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port,
  mongoUri: process.env.MONGO_URI,
  mongoServerSelectionTimeoutMs: parseInteger(
    process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS,
    5000
  ),
  mongoMaxPoolSize: parseInteger(process.env.MONGO_MAX_POOL_SIZE, 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenTtl: process.env.REFRESH_TOKEN_TTL || '30d',
  refreshCookieName: process.env.REFRESH_COOKIE_NAME || 'festivio_refresh',
  frontendUrl,
  backendUrl,
  corsOrigins,
  imgurClientId: process.env.IMGUR_CLIENT_ID,
  emailFrom: process.env.EMAIL_FROM || 'Festivio <noreply@festivio.local>',
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInteger(process.env.SMTP_PORT, 1025),
  smtpSecure: parseBoolean(process.env.SMTP_SECURE, false),
  smtpUser: process.env.SMTP_USER || process.env.EMAIL_USER,
  smtpPass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  rateLimitWindowMs: parseInteger(process.env.RATE_LIMIT_WINDOW_MS, 60000),
  rateLimitMax: parseInteger(process.env.RATE_LIMIT_MAX, 120),
  authRateLimitWindowMs: parseInteger(
    process.env.AUTH_RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000
  ),
  authRateLimitMax: parseInteger(process.env.AUTH_RATE_LIMIT_MAX, 20),
  swaggerEnabled: parseBoolean(
    process.env.SWAGGER_ENABLED,
    nodeEnv !== 'production'
  ),
  shutdownTimeoutMs: parseInteger(process.env.SHUTDOWN_TIMEOUT_MS, 10000),
});

const validateEnv = () => {
  const errors = [];
  const required = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

  if (config.isProduction) {
    required.push('FRONTEND_URL');
  }

  for (const name of required) {
    if (!process.env[name]?.trim()) {
      errors.push(`${name} is required`);
    }
  }

  if (config.isProduction && config.jwtSecret?.length < 32) {
    errors.push('JWT_SECRET must contain at least 32 characters in production');
  }

  if (config.isProduction && config.jwtRefreshSecret?.length < 32) {
    errors.push(
      'JWT_REFRESH_SECRET must contain at least 32 characters in production'
    );
  }

  if (config.isProduction && config.corsOrigins.includes('*')) {
    errors.push('CORS_ORIGINS cannot contain * in production');
  }

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration: ${errors.join('; ')}`);
  }
};

module.exports = { config, validateEnv };
