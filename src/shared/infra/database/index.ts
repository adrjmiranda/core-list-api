import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { env } from '@/shared/env/index.js';
import * as addresses from '@/shared/infra/database/drizzle/addresses.js';
import * as contacts from '@/shared/infra/database/drizzle/contacts.js';
import * as users from '@/shared/infra/database/drizzle/users.js';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { ...users, ...contacts, ...addresses },
});
