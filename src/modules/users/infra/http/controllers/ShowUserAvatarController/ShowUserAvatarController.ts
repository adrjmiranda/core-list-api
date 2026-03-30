import { inject, injectable } from 'tsyringe';

import { ShowUserAvatarService } from '#/modules/users/services/ShowUserAvatarService/ShowUserAvatarService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class ShowUserAvatarController {
	constructor(
		@inject(ShowUserAvatarService)
		private showUserAvatarService: ShowUserAvatarService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { stream, contentType } = await this.showUserAvatarService.execute({
			userId: String(httpRequest.userId),
		});

		return {
			statusCode: 200,
			headers: {
				'Content-Type': contentType,
			},
			body: stream,
		};
	};
}
