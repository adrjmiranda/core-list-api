import 'dotenv/config';

import * as z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  const formattedError = z.treeifyError(_env.error);
  console.error('❌ Invalid environment variables:');
  console.error(formattedError);
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
