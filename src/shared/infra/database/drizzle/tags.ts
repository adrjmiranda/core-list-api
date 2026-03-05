import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';

import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { users } from '@/shared/infra/database/drizzle/users.js';

export const tags = pgTable(
  'tags',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    color: text('color').default('#DBDBDB').notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [unique('unique_tag_name_per_user').on(t.name, t.userId)],
);

export const contactsToTags = pgTable(
  'contacts_to_tags',
  {
    contactId: uuid('contact_id')
      .references(() => contacts.id, { onDelete: 'cascade' })
      .notNull(),
    tagId: uuid('tag_id')
      .references(() => tags.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.contactId, t.tagId] })],
);
