import 'reflect-metadata';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeTag } from '#/test/factories/faker-data.js';

import { GetTagService } from './GetTagService.js';

describe('GetTagService (Spec)', () => {
	let getTagService: GetTagService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		getTagService = childContainer.resolve(GetTagService);
	});

	it('should throw an error if unexpected database error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await getTagService.execute({
					tagId: randomUUID(),
					userId: randomUUID(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if tag does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await getTagService.execute({
					tagId: randomUUID(),
					userId: randomUUID(),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.TAG_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it('should get a tag', async (t) => {
		const fakerTag = makeFakeTag();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerTag]),
				}),
			}),
		}));

		const { tag } = await getTagService.execute({
			tagId: fakerTag.id,
			userId: fakerTag.userId,
		});

		assert.ok(tag.id);
		assert.strictEqual(tag.id, fakerTag.id);
		assert.strictEqual(tag.userId, fakerTag.userId);
		assert.strictEqual(tag.name, fakerTag.name);
		assert.strictEqual(tag.color, fakerTag.color);
	});
});
