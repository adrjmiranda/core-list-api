import { and, eq, ilike, or, SQL, sql } from 'drizzle-orm';

import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { db } from '@/shared/infra/database/index.js';

interface ListContactsRequest {
  userId: string;
  page: number;
  perPage: number;
  search?: string;
}

export class ListContactsService {
  async execute({ userId, page, perPage, search }: ListContactsRequest) {
    const offset = (page - 1) * perPage;

    const whereConditions: SQL[] = [eq(contacts.userId, userId)];

    if (search) {
      whereConditions.push(
        or(
          ilike(contacts.name, `%${search}%`),
          ilike(contacts.email, `%${search}%`),
        ) as SQL,
      );
    }

    const data = await db
      .select()
      .from(contacts)
      .where(and(...whereConditions))
      .limit(perPage)
      .offset(offset)
      .orderBy(contacts.name);

    const [totalCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(contacts)
      .where(and(...whereConditions));

    return {
      contacts: data,
      meta: {
        page,
        perPage,
        total: Number(totalCount.count),
        totalPages: Math.ceil(Number(totalCount.count) / perPage),
      },
    };
  }
}
