import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import { AuthenticateUserController } from '#/modules/users/infra/http/controllers/AuthenticateUserController/AuthenticateUserController.js';
import { CreateUserController } from '#/modules/users/infra/http/controllers/CreateUserController/CreateUserController.js';
import { RefreshTokenController } from '#/modules/users/infra/http/controllers/RefreshTokenController/RefreshTokenController.js';
import { ResendVerificationController } from '#/modules/users/infra/http/controllers/ResendVerificationController/ResendVerificationController.js';
import { VerifyEmailController } from '#/modules/users/infra/http/controllers/VerifyEmailController/VerifyEmailController.js';
import { httpRouteAdapter } from '#/shared/adapters/HttpRouteAdapter.js';

const loginRateLimit = {
	config: {
		rateLimit: {
			max: 5,
			timeWindow: 60 * 1000,
		},
	},
};

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

	app.post('/', httpRouteAdapter(createUserController));
	app.post(
		'/sessions',
		loginRateLimit,
		httpRouteAdapter(authenticateUserController)
	);

	app.patch('/token/refresh', httpRouteAdapter(refreshTokenController));

	app.get('/verify', httpRouteAdapter(verifyEmailController));
	app.post('/verify/resend', httpRouteAdapter(resendVerificationController));
}
