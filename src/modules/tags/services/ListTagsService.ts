import { eq } from 'drizzle-orm';

import { tags } from '@/shared/infra/database/drizzle/tags.js';
import { db } from '@/shared/infra/database/index.js';

interface ListTagsRequest {
  userId: string;
}

export class ListTagsService {
  public async execute({ userId }: ListTagsRequest) {
    const tagList = await db.select().from(tags).where(eq(tags.userId, userId));

    return { tagList };
  }
}
