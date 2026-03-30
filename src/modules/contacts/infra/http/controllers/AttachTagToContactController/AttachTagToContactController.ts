import { inject, injectable } from 'tsyringe';

import { attachTagParamsSchema } from '#/modules/contacts/schemas/params/attachTagParamsSchema.js';
import { AttachTagToContactService } from '#/modules/contacts/services/AttachTagToContactService/AttachTagToContactService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class AttachTagToContactController {
	constructor(
		@inject(AttachTagToContactService)
		private attachTagToContactService: AttachTagToContactService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId, tagId } = attachTagParamsSchema.parse(
			httpRequest.params
		);
		const userId = String(httpRequest.userId);

		await this.attachTagToContactService.execute({
			contactId,
			tagId,
			userId,
		});

		return {
			statusCode: 204,
		};
	};
}
