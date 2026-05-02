import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import {
	makeFakeAddress,
	makeFakeContact,
} from '#/test/factories/faker-data.js';

import { UpdateAddressService } from './UpdateAddressService.js';

describe('UpdateAddressService (Spec)', () => {
	let updateAddressService: UpdateAddressService;
	const mockContactDataToUpdateAddress = makeFakeContact();
	const mockAddressDataToUpdate = makeFakeAddress({
		contactId: mockContactDataToUpdateAddress.id,
		isDefault: false,
	});

	beforeEach(() => {
		container.clearInstances();
		const childContainer = container.createChildContainer();
		updateAddressService = childContainer.resolve(UpdateAddressService);
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
				await updateAddressService.execute({
					addressId: mockAddressDataToUpdate.id,
					contactId: mockContactDataToUpdateAddress.id,
					userId: mockContactDataToUpdateAddress.userId,
					data: {
						...mockAddressDataToUpdate,
					},
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
				await updateAddressService.execute({
					addressId: mockAddressDataToUpdate.id,
					contactId: mockContactDataToUpdateAddress.id,
					userId: mockContactDataToUpdateAddress.userId,
					data: {
						...mockAddressDataToUpdate,
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

	it('should throw an error if the address does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([mockContactDataToUpdateAddress]),
				}),
			}),
		}));

		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateAddressService.execute({
					addressId: mockAddressDataToUpdate.id,
					contactId: mockContactDataToUpdateAddress.id,
					userId: mockContactDataToUpdateAddress.userId,
					data: {
						...mockAddressDataToUpdate,
					},
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

	it('should update the address', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([mockContactDataToUpdateAddress]),
				}),
			}),
		}));

		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () => Promise.resolve([mockAddressDataToUpdate]),
				}),
			}),
		}));

		const { address } = await updateAddressService.execute({
			addressId: mockAddressDataToUpdate.id,
			contactId: mockContactDataToUpdateAddress.id,
			userId: mockContactDataToUpdateAddress.userId,
			data: {
				...mockAddressDataToUpdate,
			},
		});

		assert.deepStrictEqual(address, mockAddressDataToUpdate);
	});
});
