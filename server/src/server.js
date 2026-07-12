const app = require('./app');
const { env } = require('./core/config/env');
const { logger } = require('./core/logger/winston');
const { prisma } = require('./core/database/prisma');

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
});

// Graceful Shutdown Architecture
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await prisma.$disconnect();
      logger.info('Prisma database connection closed.');
      process.exit(0);
    } catch (err) {
      logger.error('Error during database disconnection:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds if not gracefully closed
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Do not exit immediately; rely on graceful shutdown if critical
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err);
  gracefulShutdown('uncaughtException');
});
