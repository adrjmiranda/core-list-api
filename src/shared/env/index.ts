import 'dotenv/config';

import * as z from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  SENTRY_DSN: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  const formattedError = z.treeifyError(_env.error);
  console.error('❌ Invalid environment variables:');
  console.error(formattedError);
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
