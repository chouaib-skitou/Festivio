const crypto = require('crypto');
const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { config } = require('./config/env');
const { isDBReady } = require('./config/db');
const { apiLimiter } = require('./middlewares/rateLimiters');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', config.isProduction ? 1 : false);

app.use((req, res, next) => {
  const requestId = req.get('x-request-id') || crypto.randomUUID();
  req.id = requestId;
  res.set('x-request-id', requestId);
  res.set('x-content-type-options', 'nosniff');
  res.set('x-frame-options', 'DENY');
  res.set('referrer-policy', 'strict-origin-when-cross-origin');
  res.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');

  if (config.isProduction) {
    res.set(
      'strict-transport-security',
      'max-age=15552000; includeSubDomains'
    );
  }

  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

const corsOptions = {
  origin(origin, callback) {
    if (!origin || config.corsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    const error = new Error('Origin not allowed by CORS');
    error.status = 403;
    callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(
  '/images',
  express.static(path.join(__dirname, 'public', 'images'), {
    fallthrough: false,
    maxAge: config.isProduction ? '1d' : 0,
  })
);

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'festivio-backend',
    uptimeSeconds: Math.round(process.uptime()),
    requestId: req.id,
  });
});

app.get('/ready', (req, res) => {
  const ready = isDBReady();
  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'not_ready',
    database: ready ? 'connected' : 'disconnected',
    requestId: req.id,
  });
});

if (config.swaggerEnabled) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Festivio API Documentation',
        version: '1.0.0',
        description: 'API documentation for the Festivio application',
      },
      servers: [{ url: `${config.backendUrl}/api` }],
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/*.js'],
  };
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ service: 'Festivio API', status: 'running', requestId: req.id });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', requestId: req.id });
});

app.use((err, req, res, _next) => {
  const status = err.status || (err.name === 'MulterError' ? 400 : 500);
  const message = status >= 500 ? 'Internal server error' : err.message;
  console.error(
    JSON.stringify({
      level: 'error',
      requestId: req.id,
      method: req.method,
      path: req.originalUrl,
      status,
      error: err.message,
    })
  );
  res.status(status).json({
    message,
    requestId: req.id,
    ...(config.isProduction || status < 500 ? {} : { error: err.message }),
  });
});

module.exports = app;
