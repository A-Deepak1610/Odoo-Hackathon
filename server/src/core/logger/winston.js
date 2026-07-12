const winston = require('winston');
const { env } = require('../config/env');

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  env.NODE_ENV === 'development' 
    ? winston.format.combine(winston.format.colorize(), winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`
      ))
    : winston.format.json()
);

const transports = [
  new winston.transports.Console()
];

const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  levels: winston.config.npm.levels,
  format,
  transports,
});

module.exports = { logger };
