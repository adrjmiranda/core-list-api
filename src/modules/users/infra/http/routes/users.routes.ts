import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import { AuthenticateUserController } from '#/modules/users/infra/http/controllers/AuthenticateUserController/AuthenticateUserController.js';
import { CreateUserController } from '#/modules/users/infra/http/controllers/CreateUserController/CreateUserController.js';
import { RefreshTokenController } from '#/modules/users/infra/http/controllers/RefreshTokenController/RefreshTokenController.js';
import { ResendVerificationController } from '#/modules/users/infra/http/controllers/ResendVerificationController/ResendVerificationController.js';
import { VerifyEmailController } from '#/modules/users/infra/http/controllers/VerifyEmailController/VerifyEmailController.js';

export async function usersRoutes(app: FastifyInstance): Promise<void> {
	const createUserController = container.resolve(CreateUserController);
	const authenticateUserController = container.resolve(
		AuthenticateUserController
	);
	const refreshTokenController = container.resolve(RefreshTokenController);
	const verifyEmailController = container.resolve(VerifyEmailController);
	const resendVerificationController = container.resolve(
		ResendVerificationController
	);

	app.post('/', createUserController.handle);
	app.post(
		'/sessions',
		{
			config: {
				rateLimit: {
					max: 5,
					timeWindow: 60 * 1000,
				},
			},
		},
		authenticateUserController.handle
	);

	app.patch('/token/refresh', refreshTokenController.handle);

	app.get('/verify', verifyEmailController.handle);
	app.post('/verify/resend', resendVerificationController.handle);
}
