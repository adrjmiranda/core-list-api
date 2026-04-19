import 'reflect-metadata';

import assert from 'node:assert';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact, makeFakeTag } from '#/test/factories/faker-data.js';

import { AttachTagToContactService } from './AttachTagToContactService.js';

describe('AttachTagToContactService (Spec)', () => {
	let attachTagToContactService: AttachTagToContactService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		attachTagToContactService = childContainer.resolve(
			AttachTagToContactService
		);
	});

	it('should throw an error if an unexpected database error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await attachTagToContactService.execute({
					contactId: randomUUID(),
					tagId: randomUUID(),
					userId: randomUUID(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should an error if contact does not exist', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await attachTagToContactService.execute({
					contactId: randomUUID(),
					tagId: randomUUID(),
					userId: randomUUID(),
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

	it('should throw an error if tag does not exist', async (t) => {
		const fakerContact = makeFakeContact();

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([fakerContact]);
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
				await attachTagToContactService.execute({
					contactId: fakerContact.id,
					tagId: randomUUID(),
					userId: fakerContact.userId,
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

	it('should attach a tag to contact', async (t) => {
		const fakerContact = makeFakeContact();
		const fakerTag = makeFakeTag({ userId: fakerContact.userId });

		const selectCalls = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => {
						if (selectCalls.mock.callCount() === 1) {
							return Promise.resolve([fakerContact]);
						}

						if (selectCalls.mock.callCount() === 2) {
							return Promise.resolve([fakerTag]);
						}
					},
				}),
			}),
		}));

		t.mock.method(db, 'insert', () => ({
			values: () => ({
				execute: () => Promise.resolve(true),
			}),
		}));

		await assert.doesNotReject(async () => {
			await attachTagToContactService.execute({
				contactId: fakerContact.id,
				tagId: fakerTag.id,
				userId: fakerContact.userId,
			});
		});

		assert.strictEqual(selectCalls.mock.callCount(), 2);
	});
});
