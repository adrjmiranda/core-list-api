import { inject, injectable } from 'tsyringe';

import { getContactParamsSchema } from '#/modules/contacts/schemas/params/getContactParamsSchema.js';
import { GetContactService } from '#/modules/contacts/services/GetContactService/GetContactService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class GetContactController {
	constructor(
		@inject(GetContactService) private getContactService: GetContactService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId } = getContactParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);

		const { contact } = await this.getContactService.execute({
			contactId,
			userId,
		});

		return {
			statusCode: 200,
			body: { contact },
		};
	};
}
