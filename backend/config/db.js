const mongoose = require('mongoose');
const { config } = require('./env');

const connectDB = async () => {
  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: config.mongoServerSelectionTimeoutMs,
    maxPoolSize: config.mongoMaxPoolSize,
  });

  console.info('MongoDB connected');
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

const isDBReady = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, disconnectDB, isDBReady };
