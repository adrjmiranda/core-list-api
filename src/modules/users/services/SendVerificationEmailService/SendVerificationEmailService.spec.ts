import 'reflect-metadata';

import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';

import { container } from 'tsyringe';

import { IMailProvider } from '#/shared/container/providers/MailProvider/models/IMailProvider.js';
import { makeFakeUser } from '#/test/factories/faker-data.js';

import { SendVerificationEmailService } from './SendVerificationEmailService.js';

describe('SendVerificationEmailService (Spec)', () => {
	let sendVefiricationEmailService: SendVerificationEmailService;
	let mailProvider: IMailProvider;

	beforeEach(() => {
		const childContainer = container.createChildContainer();

		childContainer.registerInstance('MailProvider', {
			sendMail: () => Promise.resolve(),
		});

		mailProvider = childContainer.resolve<IMailProvider>('MailProvider');

		sendVefiricationEmailService = childContainer.resolve(
			SendVerificationEmailService
		);
	});

	it('should send verification email', async (t) => {
		const fakerUser = makeFakeUser();

		const { name, email, verificationToken } = fakerUser;
		const token = String(verificationToken);

		const sendMailFnMock = t.mock.method(mailProvider, 'sendMail', () =>
			Promise.resolve()
		);

		await sendVefiricationEmailService.execute({ name, email, token });

		assert.strictEqual(sendMailFnMock.mock.callCount(), 1);

		const sentArgs = sendMailFnMock.mock.calls[0].arguments[0];

		assert.ok(sentArgs);
		assert.strictEqual(sentArgs.to, fakerUser.email);
		assert.match(sentArgs.subject, /Verifique sua conta/);

		assert.ok(sentArgs.body.includes(`token=${fakerUser.verificationToken}`));
		assert.ok(sentArgs.body.includes(`<h1>Olá, ${fakerUser.name}!</h1>`));
	});

	it('should throw if mail provider fails', async (t) => {
		const fakerUser = makeFakeUser();

		const { name, email, verificationToken } = fakerUser;
		const token = String(verificationToken);

		t.mock.method(mailProvider, 'sendMail', () =>
			Promise.reject(new Error('SMTP Error'))
		);

		await assert.rejects(async () => {
			await sendVefiricationEmailService.execute({
				name,
				email,
				token,
			});
		}, /SMTP Error/);
	});
});
