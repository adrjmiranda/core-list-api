import { and, count, eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';

import tagsConfig from '#/config/tags.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { tagsTable } from '#/shared/infra/database/drizzle/tags.js';
import { db } from '#/shared/infra/database/index.js';

interface CreateTagRequest {
	userId: string;
	data: {
		name: string;
		color?: string;
	};
}

@injectable()
export class CreateTagService {
	public execute = async ({ data, userId }: CreateTagRequest) => {
		const [result] = await db
			.select({ total: count() })
			.from(tagsTable)
			.where(eq(tagsTable.userId, userId));

		if (result.total >= tagsConfig.limitPerUser) {
			throw new AppError(ERROR_CODES.TAG_LIMIT_EXCEEDED, 400);
		}

		const [existingTag] = await db
			.select()
			.from(tagsTable)
			.where(and(eq(tagsTable.name, data.name), eq(tagsTable.userId, userId)))
			.limit(1);

		if (existingTag) {
			throw new AppError(ERROR_CODES.TAG_ALREADY_EXISTS, 409);
		}

		const [tag] = await db
			.insert(tagsTable)
			.values({
				name: data.name,
				color: data.color,
				userId,
			})
			.returning();

		return { tag };
	};
}
