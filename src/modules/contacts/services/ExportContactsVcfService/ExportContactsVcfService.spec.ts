import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { faker } from '@faker-js/faker';
import { container } from 'tsyringe';

import { db } from '#/shared/infra/database/index.js';
import { contactListToVcfFormat } from '#/shared/utils/contact-list-to-vcf-format.js';
import { makeFakeContact } from '#/test/factories/faker-data.js';

import { ExportContactsVcfService } from './ExportContactsVcfService.js';

describe('ExportContactsVcfService (Spec)', () => {
	let exportContactsVcfService: ExportContactsVcfService;

	beforeEach(() => {
		const childContainer = container.createChildContainer();
		exportContactsVcfService = childContainer.resolve(ExportContactsVcfService);
	});

	it('should throw an error if database unexpected error occurs', async (t) => {
		t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => Promise.reject(new Error('Unexpected DB Error')),
			}),
		}));

		await assert.rejects(
			async () => {
				await exportContactsVcfService.execute({
					userId: faker.string.uuid(),
				});
			},
			(error: Error) => {
				return error.message === 'Unexpected DB Error';
			}
		);
	});

	it('should export the contact list in vcf format', async (t) => {
		const mockUserId = faker.string.uuid();

		const contactList = [...Array(3).keys()].map(() =>
			makeFakeContact({ userId: mockUserId })
		);

		const mockSelect = t.mock.method(db, 'select', () => ({
			from: () => ({
				where: () => Promise.resolve(contactList),
			}),
		}));

		const mockContactsInVcfFormat = contactListToVcfFormat(contactList);

		await assert.doesNotReject(async () => {
			const contactListInVcfFormat = await exportContactsVcfService.execute({
				userId: mockUserId,
			});

			assert.strictEqual(mockContactsInVcfFormat, contactListInVcfFormat);
		});

		assert.strictEqual(mockSelect.mock.callCount(), 1);
	});
});
