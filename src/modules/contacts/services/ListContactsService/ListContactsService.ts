import { and, eq, exists, ilike, inArray, or, SQL, sql } from 'drizzle-orm';

import { contactsTable } from '#/shared/infra/database/drizzle/contacts.js';
import { contactsToTagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';

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

    const whereConditions: SQL[] = [eq(contactsTable.userId, userId)];

    if (isFavorite !== undefined) {
      whereConditions.push(eq(contactsTable.isFavorite, isFavorite));
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(contactsTable.name, `%${search}%`),
          ilike(contactsTable.email, `%${search}%`),
        ) as SQL,
      );
    }

    if (tagIds && tagIds.length > 0) {
      whereConditions.push(
        exists(
          db
            .select()
            .from(contactsToTagsTable)
            .where(
              and(
                eq(contactsToTagsTable.contactId, contactsTable.id),
                inArray(contactsToTagsTable.tagId, tagIds),
              ),
            ),
        ),
      );
    }

    const filteredConditions = and(...whereConditions);

    const data = await db
      .select()
      .from(contactsTable)
      .where(filteredConditions)
      .limit(perPage)
      .offset(offset)
      .orderBy(contactsTable.name);

    const [totalCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(contactsTable)
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
