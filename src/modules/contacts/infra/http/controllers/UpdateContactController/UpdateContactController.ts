import { inject, injectable } from 'tsyringe';

import { updateContactBodySchema } from '#/modules/contacts/schemas/body/updateContactBodySchema.js';
import { getContactParamsSchema } from '#/modules/contacts/schemas/params/getContactParamsSchema.js';
import { UpdateContactService } from '#/modules/contacts/services/UpdateContactService/UpdateContactService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class UpdateContactController {
	constructor(
		@inject(UpdateContactService)
		private updateContactService: UpdateContactService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId } = getContactParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);
		const data = updateContactBodySchema.parse(httpRequest.body);

		const { contact } = await this.updateContactService.execute({
			contactId,
			userId,
			data,
		});

		return {
			statusCode: 200,
			body: { contact },
		};
	};
}
