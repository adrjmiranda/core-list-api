import { inject, injectable } from 'tsyringe';

import { getAddressParamsSchema } from '#/modules/addresses/schemas/params/getAddressParamsSchema.js';
import { DeleteAddressService } from '#/modules/addresses/services/DeleteAddressService/DeleteAddressService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class DeleteAddressController {
	constructor(
		@inject(DeleteAddressService)
		private deleteAddressService: DeleteAddressService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { contactId, addressId } = getAddressParamsSchema.parse(
			httpRequest.params
		);
		const userId = String(httpRequest.userId);

		await this.deleteAddressService.execute({
			contactId,
			addressId,
			userId,
		});

		return {
			statusCode: 204,
		};
	};
}
