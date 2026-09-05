const http = require('http');
const app = require('./app');
const { config, validateEnv } = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');

const startServer = async () => {
  validateEnv();
  await connectDB();

  const server = http.createServer(app);
  server.requestTimeout = 30000;
  server.headersTimeout = 65000;
  server.keepAliveTimeout = 5000;

  server.listen(config.port, () => {
    console.info(`Festivio backend listening on port ${config.port}`);
  });

  let shuttingDown = false;

  const shutdown = async (signal) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    console.info(`${signal} received, shutting down gracefully`);

    const forceExitTimer = setTimeout(() => {
      console.error('Graceful shutdown timed out');
      process.exit(1);
    }, config.shutdownTimeoutMs);
    forceExitTimer.unref();

    server.close(async (error) => {
      try {
        await disconnectDB();
      } catch (dbError) {
        console.error('MongoDB disconnect failed:', dbError.message);
      }

      clearTimeout(forceExitTimer);
      process.exit(error ? 1 : 0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error('Unable to start Festivio backend:', error.message);
  process.exit(1);
});
