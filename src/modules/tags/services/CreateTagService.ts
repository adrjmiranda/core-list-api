import { tags } from '@/shared/infra/database/drizzle/tags.js';
import { db } from '@/shared/infra/database/index.js';

interface CreateTagRequest {
  name: string;
  userId: string;
}

export class CreateTagService {
  async execute({ name, userId }: CreateTagRequest) {
    const [tag] = await db
      .insert(tags)
      .values({
        name,
        userId,
      })
      .returning();

    return { tag };
  }
}
