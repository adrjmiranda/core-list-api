import 'reflect-metadata';

import assert from 'node:assert';
import { Readable } from 'node:stream';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { ShowContactAvatarService } from './ShowContactAvatarService.js';

describe('ShowContactAvatarService (Spec)', () => {
	let showContactAvatarService: ShowContactAvatarService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		showContactAvatarService = childContainer.resolve(ShowContactAvatarService);
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
				await showContactAvatarService.execute({
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
				await showContactAvatarService.execute({
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

	it('should throw an error if contact avatar does not exist', async (t) => {
		const fakerContact = makeFakeContact({ avatar: undefined });

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerContact]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await showContactAvatarService.execute({
					contactId: fakerContact.id,
					userId: fakerContact.userId,
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.CONTACT_AVATAR_NOT_FOUND);
				assert.strictEqual(error.statusCode, 401);
				return true;
			}
		);
	});

	it('should throw an error if file does not exist', async (t) => {
		const fakerContact = makeFakeContact();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerContact]),
				}),
			}),
		}));

		t.mock.method(path, 'resolve', () => fakerContact.avatar);
		t.mock.method(fs, 'existsSync', () => false);

		await assert.rejects(
			async () => {
				await showContactAvatarService.execute({
					contactId: fakerContact.id,
					userId: fakerContact.userId,
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.FILE_NOT_FOUND);
				assert.strictEqual(error.statusCode, 404);
				return true;
			}
		);
	});

	it("should return the contact's avatar image", async (t) => {
		const fakerContact = makeFakeContact();

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerContact]),
				}),
			}),
		}));

		t.mock.method(path, 'resolve', () => fakerContact.avatar);
		t.mock.method(fs, 'existsSync', () => true);

		t.mock.method(fs, 'createReadStream', () => {
			return Readable.from(['faker-image-content']);
		});

		const response = await showContactAvatarService.execute({
			contactId: fakerContact.id,
			userId: fakerContact.userId,
		});

		assert.ok(response.stream instanceof Readable);
		assert.strictEqual(response.contentType, 'image/jpeg');
	});
});
