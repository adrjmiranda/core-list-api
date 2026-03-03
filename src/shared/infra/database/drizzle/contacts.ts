import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from '@/shared/infra/database/drizzle/users.js';

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull(),

  isFavorite: boolean('is_favorite').default(false).notNull(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  tenantId: text('tenant_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
