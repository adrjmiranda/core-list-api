import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact, makeFakeTag } from '#/test/factories/faker-data.js';

import { ListContactsService } from './ListContactsService.js';

describe('ListContactsService (Spec)', () => {
	let listContactsService: ListContactsService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		listContactsService = childContainer.resolve(ListContactsService);
	});

	it('should throw an error if database unexpected error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => ({
						offset: () => ({
							orderBy: () => Promise.reject(new Error('Unexpected DB Error')),
						}),
					}),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await listContactsService.execute({
					userId: faker.string.uuid(),
					page: faker.number.int({ min: 1 }),
					perPage: faker.number.int({ min: 10 }),
					isFavorite: faker.datatype.boolean(),
					search: faker.string.alpha(),
					tagIds: [faker.string.uuid()],
				});
			},
			(error: Error) => {
				console.log(error.message);
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should list the contacts correctly', async (t) => {
		const mockUserId = faker.string.uuid();
		const fakerContact = makeFakeContact({ userId: mockUserId });
		const contactList = [fakerContact];
		const fakerTag = makeFakeTag({ userId: mockUserId });

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => {
					if (selectCalls.mock.callCount() === 3) {
						return Promise.resolve([{ count: contactList.length }]);
					}

					if (selectCalls.mock.callCount() === 2) {
						return {
							limit: () => ({
								offset: () => ({
									orderBy: () => Promise.resolve(contactList),
								}),
							}),
						};
					}
				},
			}),
		}));

		const { contacts } = await listContactsService.execute({
			userId: mockUserId,
			page: faker.number.int({ min: 1 }),
			perPage: faker.number.int({ min: 10 }),
			isFavorite: faker.datatype.boolean(),
			search: fakerContact.name,
			tagIds: [fakerTag.id],
		});

		assert.deepStrictEqual(contactList, contacts);
	});
});
