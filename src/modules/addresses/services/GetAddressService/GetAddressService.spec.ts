import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import {
	makeFakeAddress,
	makeFakeContact,
} from '#/test/factories/faker-data.js';

import { GetAddressService } from './GetAddressService.js';

describe('GetAddressService (Spec)', () => {
	let getAddressService: GetAddressService;

	beforeEach(() => {
		container.clearInstances();
		const childContainer = container.createChildContainer();
		getAddressService = childContainer.resolve(GetAddressService);
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
				await getAddressService.execute({
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
				await getAddressService.execute({
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

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([mockContact]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([]);
						}
					},
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await getAddressService.execute({
					addressId: faker.string.uuid(),
					contactId: mockContact.id,
					userId: mockContact.userId,
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

	it('should return the address', async (t) => {
		const mockContact = makeFakeContact();
		const mockAddress = makeFakeAddress({ contactId: mockContact.id });

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([mockContact]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([mockAddress]);
						}
					},
				}),
			}),
		}));

		const { address } = await getAddressService.execute({
			addressId: mockAddress.id,
			contactId: mockContact.id,
			userId: mockContact.userId,
		});

		assert.ok(address);
		assert.deepStrictEqual(address, mockAddress);
	});
});
