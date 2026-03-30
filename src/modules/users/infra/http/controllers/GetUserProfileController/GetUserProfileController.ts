import { inject, injectable } from 'tsyringe';

import { GetUserProfileService } from '#/modules/users/services/GetUserProfileService/GetUserProfileService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class GetUserProfileController {
	constructor(
		@inject(GetUserProfileService)
		private getUserProfileService: GetUserProfileService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { user } = await this.getUserProfileService.execute({
			userId: String(httpRequest.userId),
		});

		return {
			statusCode: 200,
			body: { user },
		};
	};
}
