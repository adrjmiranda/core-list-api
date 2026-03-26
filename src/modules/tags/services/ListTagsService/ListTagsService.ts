import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import { tagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';

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
