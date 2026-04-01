import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { db } from '#/shared/infra/database/index.js';

import { DeleteUserService } from './DeleteUserService.js';

describe('DeleteUserService (Spec)', () => {
	let deleteUserService: DeleteUserService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		deleteUserService = childContainer.resolve(DeleteUserService);
	});

	it('should throw an error if an unexpected database error occurs', async (t) => {
		t.mock.method(db, 'delete', () => ({
			where: () => ({
				execute: () => Promise.reject(new Error('Unexpected DB Error')),
			}),
		}));

		await assert.rejects(
			async () => {
				await deleteUserService.execute({ userId: 'user_id' });
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should delete user', async (t) => {
		t.mock.method(db, 'delete', () => ({
			where: () => ({
				execute: () => Promise.resolve(),
			}),
		}));

		await assert.doesNotReject(async () => {
			await deleteUserService.execute({ userId: 'user_id' });
		});
	});
});
