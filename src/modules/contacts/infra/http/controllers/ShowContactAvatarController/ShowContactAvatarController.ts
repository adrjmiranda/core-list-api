import { inject, injectable } from 'tsyringe';

import { showContactAvatarParamsSchema } from '#/modules/contacts/schemas/params/showContactAvatarParamsSchema.js';
import { ShowContactAvatarService } from '#/modules/contacts/services/ShowContactAvatarService/ShowContactAvatarService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class ShowContactAvatarController {
	constructor(
		@inject(ShowContactAvatarService)
		private showContactAvatarService: ShowContactAvatarService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId } = showContactAvatarParamsSchema.parse(
			httpRequest.params
		);
		const userId = String(httpRequest.userId);

		const { stream, contentType } = await this.showContactAvatarService.execute(
			{
				contactId,
				userId,
			}
		);

		return {
			statusCode: 200,
			headers: {
				'Content-Type': contentType,
			},
			body: stream,
		};
	};
}
