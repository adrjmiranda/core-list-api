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

import { ListAddressesService } from './ListAddressesService.js';

describe('ListAddressesService (Spec)', () => {
	let listAddressesService: ListAddressesService;

	beforeEach(() => {
		container.clearInstances();
		const childContainer = container.createChildContainer();
		listAddressesService = childContainer.resolve(ListAddressesService);
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
				await listAddressesService.execute({
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
				await listAddressesService.execute({
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

	it('should list the addresses', async (t) => {
		const mockContact = makeFakeContact();
		const mockAddressList = Array.from({ length: 5 }, () =>
			makeFakeAddress({ contactId: mockContact.id })
		);

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => {
					if (selectCalls.mock.callCount() === 1) {
						return {
							limit: () => Promise.resolve([mockContact]),
						};
					}

					if (selectCalls.mock.callCount() === 2) {
						return {
							orderBy: () => ({
								execute: () => Promise.resolve(mockAddressList),
							}),
						};
					}
				},
			}),
		}));

		const { addresses } = await listAddressesService.execute({
			contactId: mockContact.id,
			userId: mockContact.userId,
		});

		assert.deepStrictEqual(addresses, mockAddressList);
	});
});
