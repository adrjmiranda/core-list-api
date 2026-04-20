import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { DeleteContactService } from './DeleteContactService.js';

describe('DeleteContactService (Spec)', () => {
	let deleteContactService: DeleteContactService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		deleteContactService = childContainer.resolve(DeleteContactService);
	});

	it('should throw an error if database unexpected error occurs', async (t) => {
		t.mock.method(db, 'delete', () => ({
			where: () => ({
				returning: () => Promise.reject(new Error('Unexpected DB Error')),
			}),
		}));

		await assert.rejects(
			async () => {
				await deleteContactService.execute({
					contactId: faker.string.uuid(),
					userId: faker.string.uuid(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if contact is not deleted', async (t) => {
		t.mock.method(db, 'delete', () => ({
			where: () => ({
				returning: () => Promise.resolve([]),
			}),
		}));

		await assert.rejects(
			async () => {
				await deleteContactService.execute({
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

	it('should delete a contact', async (t) => {
		const fakerContact = makeFakeContact();

		const deleteMock = t.mock.method(db, 'delete', () => ({
			where: () => ({
				returning: () => Promise.resolve([fakerContact]),
			}),
		}));

		await assert.doesNotReject(async () => {
			await deleteContactService.execute({
				contactId: fakerContact.id,
				userId: fakerContact.userId,
			});
		});

		assert.strictEqual(deleteMock.mock.callCount(), 1);
	});
});
