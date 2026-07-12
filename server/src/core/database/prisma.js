const { env } = require('../config/env');
const { logger } = require('../logger/winston');

let PrismaClient;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (err) {
  logger.warn('Prisma Client not found. Please add a model to schema.prisma and run `npx prisma generate`.');
  // Mock PrismaClient for initial bootstrapping without models
  PrismaClient = class {
    constructor() {}
    async $disconnect() {}
  };
}

let prisma;

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

module.exports = { prisma };
