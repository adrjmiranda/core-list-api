import { inject, injectable } from 'tsyringe';

import { updateUserBodySchema } from '#/modules/users/schemas/body/updateUserBodySchema.js';
import { UpdateUserService } from '#/modules/users/services/UpdateUserService/UpdateUserService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class UpdateUserController {
	constructor(
		@inject(UpdateUserService) private updateUserService: UpdateUserService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const userId = String(httpRequest.userId);
		const data = updateUserBodySchema.parse(httpRequest.body);

		const { user } = await this.updateUserService.execute({ userId, data });

		return {
			statusCode: 200,
			body: { user },
		};
	};
}
