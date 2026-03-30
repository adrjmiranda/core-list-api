import { inject, injectable } from 'tsyringe';

import { verifyEmailQuerySchema } from '#/modules/users/schemas/queries/verifyEmailQuerySchema.js';
import { VerifyEmailService } from '#/modules/users/services/VerifyEmailService/VerifyEmailService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';
import { env } from '#/shared/env/env.js';

@injectable()
export class VerifyEmailController {
	constructor(
		@inject(VerifyEmailService) private verifyEmailService: VerifyEmailService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { token } = verifyEmailQuerySchema.parse(httpRequest.query);

		await this.verifyEmailService.execute({ token });

		return {
			statusCode: 302,
			redirect: `${env.WEB_URL}/login?verified=true`,
		};
	};
}
