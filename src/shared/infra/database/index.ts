import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { env } from '@/shared/env/index.js';

import * as addresses from './drizzle/addresses.js';
import * as contacts from './drizzle/contacts.js';
import * as users from './drizzle/users.js';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { ...users, ...contacts, ...addresses },
});
