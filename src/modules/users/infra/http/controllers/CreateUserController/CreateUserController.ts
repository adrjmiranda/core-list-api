import { inject, injectable } from 'tsyringe';

import { createUserBodySchema } from '#/modules/users/schemas/body/createUserBodySchema.js';
import { CreateUserService } from '#/modules/users/services/CreateUserService/CreateUserService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class CreateUserController {
	constructor(
		@inject(CreateUserService) private createUserService: CreateUserService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { name, email, password } = createUserBodySchema.parse(
			httpRequest.body
		);

		const { user } = await this.createUserService.execute({
			name,
			email,
			passwordHash: password,
		});

		return {
			statusCode: 201,
			body: { user },
		};
	};
}
