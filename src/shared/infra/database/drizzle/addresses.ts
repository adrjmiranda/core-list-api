import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { contacts } from '@/shared/infra/database/drizzle/contacts.js';

export const addresses = pgTable('addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  street: text('street').notNull(),
  number: text('number').notNull(),
  complement: text('complement'),
  neighborhood: text('neighborhood').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),

  isDefault: boolean('is_default').default(false).notNull(),

  contactId: uuid('contact_id')
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
