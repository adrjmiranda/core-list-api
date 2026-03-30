import { inject, injectable } from 'tsyringe';

import { DeleteUserService } from '#/modules/users/services/DeleteUserService/DeleteUserService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class DeleteUserController {
	constructor(
		@inject(DeleteUserService) private deleteUserService: DeleteUserService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const userId = String(httpRequest.userId);

		await this.deleteUserService.execute({ userId });

		return {
			statusCode: 204,
		};
	};
}
