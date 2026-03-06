import 'dotenv/config';

import * as z from 'zod';

const envSchema = z.object({
  // === Application ===
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  APP_NAME: z.string().default('CoreList API'),

  // === URLs ===
  // Nota: z.string().url() é mais seguro que z.url() em algumas versões do Zod
  API_URL: z.string().url(),
  WEB_URL: z.string().url(),

  // === Server Configuration ===
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),

  // === Database ===
  DATABASE_URL: z.string().url(),

  // === Auth & Security ===
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('1d'),

  // === Observability ===
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
