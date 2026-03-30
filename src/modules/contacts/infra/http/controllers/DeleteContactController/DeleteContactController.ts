import { inject, injectable } from 'tsyringe';

import { getContactParamsSchema } from '#/modules/contacts/schemas/params/getContactParamsSchema.js';
import { DeleteContactService } from '#/modules/contacts/services/DeleteContactService/DeleteContactService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class DeleteContactController {
	constructor(
		@inject(DeleteContactService)
		private deleteContactService: DeleteContactService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId } = getContactParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);

		await this.deleteContactService.execute({ contactId, userId });

		return {
			statusCode: 204,
		};
	};
}
