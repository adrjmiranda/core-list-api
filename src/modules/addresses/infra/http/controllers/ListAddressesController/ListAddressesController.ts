import { inject, injectable } from 'tsyringe';

import { ListAddressesService } from '#/modules/addresses/services/ListAddressesService/ListAddressesService.js';
import { getContactParamsSchema } from '#/modules/contacts/schemas/params/getContactParamsSchema.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class ListAddressesController {
	constructor(
		@inject(ListAddressesService)
		private listAddressesService: ListAddressesService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId } = getContactParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);

		const { addresses } = await this.listAddressesService.execute({
			contactId,
			userId,
		});

		return {
			statusCode: 200,
			body: {
				addresses,
			},
		};
	};
}
