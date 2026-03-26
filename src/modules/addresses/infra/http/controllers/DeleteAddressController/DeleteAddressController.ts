import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { getAddressParamsSchema } from '#/modules/addresses/schemas/getAddressParamsSchema.js';
import { DeleteAddressService } from '#/modules/addresses/services/DeleteAddressService/DeleteAddressService.js';

@injectable()
export class DeleteAddressController {
	constructor(
		@inject(DeleteAddressService)
		private deleteAddressService: DeleteAddressService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { contactId, addressId } = getAddressParamsSchema.parse(
			request.params
		);
		const userId = request.user.sub;

		await this.deleteAddressService.execute({
			contactId,
			addressId,
			userId,
		});

		return reply.status(204).send();
	};
}
