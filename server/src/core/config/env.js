const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  JWT_SECRET: z.string().default('assertflow_jwt_secret_key_123'),
  JWT_REFRESH_SECRET: z.string().default('assertflow_jwt_refresh_secret_key_456'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:\n', _env.error.format());
  process.exit(1);
}

module.exports = {
  env: _env.data,
};
