import { inject, injectable } from 'tsyringe';

import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { ITokenProvider } from '#/shared/container/providers/TokenProvider/models/ITokenProvider.js';
import { AppError } from '#/shared/errors/AppError.js';

@injectable()
export class RefreshTokenController {
	constructor(
		@inject('TokenProvider')
		private tokenProvider: ITokenProvider
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { refreshToken: token } = httpRequest.cookies as {
			refreshToken?: string;
		};

		if (!token) {
			throw new AppError(ERROR_CODES.UNAUTHORIZED, 401);
		}

		const { sub: userId, role, isVerified } = this.tokenProvider.verify(token);

		const payload = {
			role: role,
			isVerified: isVerified,
		};

		const accessToken = this.tokenProvider.generate(payload, userId, '15m');
		const refreshToken = this.tokenProvider.generate(payload, userId, '7d');

		return {
			statusCode: 200,
			body: {
				accessToken,
				refreshToken,
			},
		};
	};
}
