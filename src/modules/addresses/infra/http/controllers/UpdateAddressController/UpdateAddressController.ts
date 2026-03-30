import { inject, injectable } from 'tsyringe';

import { updateAddressBodySchema } from '#/modules/addresses/schemas/body/updateAddressBodySchema.js';
import { getAddressParamsSchema } from '#/modules/addresses/schemas/params/getAddressParamsSchema.js';
import { UpdateAddressService } from '#/modules/addresses/services/UpdateAddressService/UpdateAddressService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class UpdateAddressController {
	constructor(
		@inject(UpdateAddressService)
		private updateAddressService: UpdateAddressService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId, addressId } = getAddressParamsSchema.parse(
			httpRequest.params
		);
		const userId = String(httpRequest.userId);
		const data = updateAddressBodySchema.parse(httpRequest.body);

		const { address } = await this.updateAddressService.execute({
			contactId,
			addressId,
			userId,
			data,
		});

		return {
			statusCode: 200,
			body: { address },
		};
	};
}
