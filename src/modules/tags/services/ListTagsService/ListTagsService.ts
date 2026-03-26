import { eq } from 'drizzle-orm';

import { tagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';
import { injectable } from 'tsyringe';

interface ListTagsRequest {
  userId: string;
}

@injectable()
export class ListTagsService {
  public execute = async ({ userId }: ListTagsRequest) => {
    const tagList = await db
      .select()
      .from(tagsTable)
      .where(eq(tagsTable.userId, userId));

    return { tagList };
  };
}
