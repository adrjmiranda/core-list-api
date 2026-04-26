import 'reflect-metadata';

import assert from 'node:assert';
import path from 'node:path';
import { Readable } from 'node:stream';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { IStorageProvider } from '#/shared/container/providers/StorageProvider/models/IStorageProvider.js';
import { AppError } from '#/shared/errors/AppError.js';
import { db } from '#/shared/infra/database/index.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { UpdateContactAvatarService } from './UpdateContactAvatarService.js';

describe('UpdateContactAvatarService (Spec)', () => {
	let updateContactAvatarService: UpdateContactAvatarService;
	let storageProvider: IStorageProvider;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		const storageProviderMock = {
			saveFile: async (_fileName: string, _fileStream: NodeJS.ReadableStream) =>
				'',
			deleteFile: async () => {},
		};

		childContainer.registerInstance('StorageProvider', storageProviderMock);
		storageProvider =
			childContainer.resolve<IStorageProvider>('StorageProvider');

		updateContactAvatarService = childContainer.resolve(
			UpdateContactAvatarService
		);
	});

	it('should throw an error if database unexpeted error occurs', async (t) => {
		t.mock.method(path, 'extname', () => '.jpeg');

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.reject(new Error('Unexpected DB Error')),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateContactAvatarService.execute({
					userId: faker.string.uuid(),
					contactId: faker.string.uuid(),
					avatarFilename: faker.string.alpha(),
					fileStream: Readable.from(['faker-image-content']),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should throw an error if contact does not exist', async (t) => {
		t.mock.method(path, 'extname', () => '.jpeg');

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateContactAvatarService.execute({
					userId: faker.string.uuid(),
					contactId: faker.string.uuid(),
					avatarFilename: faker.string.alpha(),
					fileStream: Readable.from(['faker-image-content']),
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

	it('should throw an error if the user is not the owner of the contact', async (t) => {
		const mockUserId = faker.string.uuid();
		const mockAnotherUserId = faker.string.uuid();
		const fakerContact = makeFakeContact({ userId: mockUserId });

		t.mock.method(path, 'extname', () => '.jpeg');

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerContact]),
				}),
			}),
		}));

		await assert.rejects(
			async () => {
				await updateContactAvatarService.execute({
					userId: mockAnotherUserId,
					contactId: faker.string.uuid(),
					avatarFilename: faker.string.alpha(),
					fileStream: Readable.from(['faker-image-content']),
				});
			},
			(error: unknown) => {
				assert.ok(error instanceof AppError);
				assert.strictEqual(error.code, ERROR_CODES.UNAUTHORIZED);
				assert.strictEqual(error.statusCode, 401);
				return true;
			}
		);
	});

	it("should update the contact's avatar", async (t) => {
		const mockUserId = faker.string.uuid();
		const fakerContact = makeFakeContact({ userId: mockUserId });

		const mockExtname = '.jpeg';
		t.mock.method(path, 'extname', () => mockExtname);

		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => ({
					limit: () => Promise.resolve([fakerContact]),
				}),
			}),
		}));

		const mockAvatarFileame = faker.string.uuid + mockExtname;

		t.mock.method(db, 'update', () => ({
			set: () => ({
				where: () => ({
					returning: () =>
						Promise.resolve([{ ...fakerContact, avatar: mockAvatarFileame }]),
				}),
			}),
		}));

		t.mock.method(storageProvider, 'saveFile', () => mockAvatarFileame);

		const { avatar: avatarFilename } = await updateContactAvatarService.execute(
			{
				userId: mockUserId,
				contactId: faker.string.uuid(),
				avatarFilename: faker.string.alpha(),
				fileStream: Readable.from(['faker-image-content']),
			}
		);

		assert.strictEqual(avatarFilename, mockAvatarFileame);
	});
});
