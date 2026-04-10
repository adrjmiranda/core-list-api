import 'reflect-metadata';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { db } from '#/shared/infra/database/index.js';
import { makeFakeTag } from '#/test/factories/faker-data.js';

import { ListTagsService } from './ListTagsService.js';

describe('ListTagsService (Spec)', () => {
	let listTagsService: ListTagsService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		listTagsService = childContainer.resolve(ListTagsService);
	});

	it('should throw an error if an unexpected database error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					execute: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await listTagsService.execute({
					userId: randomUUID(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should return the user tags', async (t) => {
		const mockUserId = randomUUID();

		const tagList = [...Array(3).keys()].map(() =>
			makeFakeTag({ userId: mockUserId })
		);

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					execute: () => Promise.resolve(tagList),
				}),
			}),
		}));

		const { tagList: tags } = await listTagsService.execute({
			userId: mockUserId,
		});

		assert.deepStrictEqual(tags, tagList);
	});
});
