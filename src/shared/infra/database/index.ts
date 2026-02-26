import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import * as addresses from './drizzle/addresses.js';
import * as contacts from './drizzle/contacts.js';
import * as users from './drizzle/users.js';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: { ...users, ...contacts, ...addresses },
});
