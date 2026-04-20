import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { GetContactService } from './GetContactService.js';

describe('GetContactService (Spec)', () => {
	let getContactService: GetContactService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		getContactService = childContainer.resolve(GetContactService);
	});

	it('should throw an error if database unexpected error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await getContactService.execute({
					contactId: faker.string.uuid(),
					userId: faker.string.uuid(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if contact does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await getContactService.execute({
					contactId: faker.string.uuid(),
					userId: faker.string.uuid(),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.CONTACT_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it('should get a contact', async (t) => {
		const fakerContact = makeFakeContact();

		const mockSelect = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerContact]),
				}),
			}),
		}));

		const { contact } = await getContactService.execute({
			contactId: fakerContact.id,
			userId: fakerContact.userId,
		});

		assert.strictEqual(mockSelect.mock.callCount(), 1);

		assert.deepStrictEqual(contact, fakerContact);
	});
});
