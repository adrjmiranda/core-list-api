import { inject, injectable } from 'tsyringe';

import { updatePasswordBodySchema } from '#/modules/users/schemas/body/updatePasswordBodySchema.js';
import { UpdatePasswordService } from '#/modules/users/services/UpdatePasswordService/UpdatePasswordService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class UpdatePasswordController {
	constructor(
		@inject(UpdatePasswordService)
		private updatePasswordService: UpdatePasswordService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const userId = String(httpRequest.userId);
		const { oldPassword, newPassword } = updatePasswordBodySchema.parse(
			httpRequest.body
		);

		await this.updatePasswordService.execute({
			userId,
			oldPassword,
			newPassword,
		});

		return {
			statusCode: 204,
		};
	};
}
