const { env } = require('../config/env');
const { logger } = require('../logger/winston');

let PrismaClient;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (err) {
  PrismaClient = null;
}

let prisma = {
  $disconnect: async () => {},
};

if (PrismaClient) {
  try {
    if (env.NODE_ENV === 'production') {
      prisma = new PrismaClient();
    } else {
      // Prevent multiple instances of Prisma Client in development
      if (!global.__prisma) {
        global.__prisma = new PrismaClient({
          log: ['query', 'error', 'warn'],
        });
      }
      prisma = global.__prisma;
    }
  } catch (err) {
    logger.warn('Prisma Client failed to initialize. Please add a model to schema.prisma and run `npx prisma generate`.');
  }
} else {
  logger.warn('Prisma Client not found. Please install dependencies and run `npx prisma generate`.');
}

module.exports = { prisma };
