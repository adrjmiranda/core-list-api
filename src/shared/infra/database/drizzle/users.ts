import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER', 'MANAGER']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationToken: text('verification_token'),
  tokenExpiresAt: timestamp('token_expires_at'),
  role: userRoleEnum('role').default('USER').notNull(),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true),
  tenantId: text('tenant_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
