import { inject, injectable } from 'tsyringe';

import { getAddressParamsSchema } from '#/modules/addresses/schemas/params/getAddressParamsSchema.js';
import { GetAddressService } from '#/modules/addresses/services/GetAddressService/GetAddressService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class GetAddressController {
	constructor(
		@inject(GetAddressService) private getAddressService: GetAddressService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId, addressId } = getAddressParamsSchema.parse(
			httpRequest.params
		);
		const userId = String(httpRequest.userId);

		const { address } = await this.getAddressService.execute({
			contactId,
			addressId,
			userId,
		});

		return {
			statusCode: 200,
			body: { address },
		};
	};
}
