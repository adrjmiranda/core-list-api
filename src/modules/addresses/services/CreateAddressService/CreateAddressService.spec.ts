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

import { CreateAddressService } from './CreateAddressService.js';

describe('CreateAddressService (Spec)', () => {
	let createAddressService: CreateAddressService;

	let mockAddresssData = makeFakeAddress();

	beforeEach(() => {
		container.clearInstances();
		const childContainer = container.createChildContainer();
		createAddressService = childContainer.resolve(CreateAddressService);
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
				await createAddressService.execute({
					userId: faker.string.uuid(),
					contactId: mockAddresssData.contactId,
					data: {
						...mockAddresssData,
					},
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if the contact does not exists', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await createAddressService.execute({
					userId: faker.string.uuid(),
					contactId: mockAddresssData.contactId,
					data: {
						...mockAddresssData,
					},
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

	it('should successfully create an address', async (t) => {
		const mockContactData = makeFakeContact();
		mockAddresssData = { ...mockAddresssData, contactId: mockContactData.id };

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([mockContactData]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([mockAddresssData]);
						}
					},
				}),
			}),
		}));

		t.mock.method(db, 'insert', () => ({
			values: () => ({
				returning: () => Promise.resolve([mockAddresssData]),
			}),
		}));

		const { address } = await createAddressService.execute({
			userId: faker.string.uuid(),
			contactId: mockAddresssData.contactId,
			data: {
				...mockAddresssData,
			},
		});

		assert.ok(address);
		assert.deepStrictEqual(address, mockAddresssData);
	});
});
