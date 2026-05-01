import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { DeleteAddressService } from './DeleteAddressService.js';

describe('DeleteAddressService (Spec)', () => {
	let deleteAddressService: DeleteAddressService;

	beforeEach(() => {
		container.clearInstances();
		const childContainer = container.createChildContainer();
		deleteAddressService = childContainer.resolve(DeleteAddressService);
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
				await deleteAddressService.execute({
					addressId: faker.string.uuid(),
					contactId: faker.string.uuid(),
					userId: faker.string.uuid(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if the contact does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await deleteAddressService.execute({
					addressId: faker.string.uuid(),
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

	it('should throw an error if the address does not exist', async (t) => {
		const mockContact = makeFakeContact();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([mockContact]),
				}),
			}),
		}));

		t.mock.method(db, 'delete', () => ({
			where: () => ({
				returning: () => Promise.resolve([]),
			}),
		}));

		await assert.rejects(
			async () => {
				await deleteAddressService.execute({
					addressId: faker.string.uuid(),
					contactId: faker.string.uuid(),
					userId: faker.string.uuid(),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.ADDRESS_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});
});
