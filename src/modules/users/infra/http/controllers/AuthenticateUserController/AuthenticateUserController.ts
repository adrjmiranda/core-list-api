import { inject, injectable } from 'tsyringe';

import { authenticateBodySchema } from '#/modules/users/schemas/body/authenticateBodySchema.js';
import { AuthenticateUserService } from '#/modules/users/services/AuthenticateUserService/AuthenticateUserService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';
import { ITokenProvider } from '#/shared/container/providers/TokenProvider/models/ITokenProvider.js';

@injectable()
export class AuthenticateUserController {
	constructor(
		@inject(AuthenticateUserService)
		private authenticateUserService: AuthenticateUserService,

		@inject('TokenProvider')
		private tokenProvider: ITokenProvider
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { email, password } = authenticateBodySchema.parse(httpRequest.body);

		const user = await this.authenticateUserService.execute({
			email,
			password,
		});

		const payload = {
			role: user.role,
			isVerified: user.isVerified,
		};

		const accessToken = this.tokenProvider.generate(payload, user.id, '15m');
		const refreshToken = this.tokenProvider.generate(payload, user.id, '7d');

		return {
			statusCode: 200,
			body: {
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				},
				accessToken,
				refreshToken,
			},
		};
	};
}
