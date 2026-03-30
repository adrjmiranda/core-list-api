import { inject, injectable } from 'tsyringe';

import { createAddressBodySchema } from '#/modules/addresses/schemas/body/createAddressBodySchema.js';
import { CreateAddressService } from '#/modules/addresses/services/CreateAddressService/CreateAddressService.js';
import { getContactParamsSchema } from '#/modules/contacts/schemas/params/getContactParamsSchema.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class CreateAddressController {
	constructor(
		@inject(CreateAddressService)
		private createAddressService: CreateAddressService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId } = getContactParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);
		const data = createAddressBodySchema.parse(httpRequest.body);

		const { address } = await this.createAddressService.execute({
			contactId,
			userId,
			data,
		});

		return {
			statusCode: 201,
			body: { address },
		};
	};
}
