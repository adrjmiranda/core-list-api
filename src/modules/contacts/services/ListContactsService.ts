import { and, eq, exists, ilike, inArray, or, SQL, sql } from 'drizzle-orm';

import { contacts } from '@/shared/infra/database/drizzle/contacts.js';
import { contactsToTags } from '@/shared/infra/database/drizzle/tags.js';
import { db } from '@/shared/infra/database/index.js';

interface ListContactsRequest {
  userId: string;
  page: number;
  perPage: number;
  search?: string;
  isFavorite?: boolean;
  tagIds?: string[];
}

export class ListContactsService {
  public async execute({
    userId,
    page,
    perPage,
    search,
    isFavorite,
    tagIds,
  }: ListContactsRequest) {
    const offset = (page - 1) * perPage;

    const whereConditions: SQL[] = [eq(contacts.userId, userId)];

    if (isFavorite !== undefined) {
      whereConditions.push(eq(contacts.isFavorite, isFavorite));
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(contacts.name, `%${search}%`),
          ilike(contacts.email, `%${search}%`),
        ) as SQL,
      );
    }

    if (tagIds && tagIds.length > 0) {
      whereConditions.push(
        exists(
          db
            .select()
            .from(contactsToTags)
            .where(
              and(
                eq(contactsToTags.contactId, contacts.id),
                inArray(contactsToTags.tagId, tagIds),
              ),
            ),
        ),
      );
    }

    const filteredConditions = and(...whereConditions);

    const data = await db
      .select()
      .from(contacts)
      .where(filteredConditions)
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
