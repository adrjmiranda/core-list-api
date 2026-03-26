import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { getAddressParamsSchema } from '#/modules/addresses/schemas/getAddressParamsSchema.js';
import { GetAddressService } from '#/modules/addresses/services/GetAddressService/GetAddressService.js';

@injectable()
export class GetAddressController {
	constructor(
		@inject(GetAddressService) private getAddressService: GetAddressService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { contactId, addressId } = getAddressParamsSchema.parse(
			request.params
		);
		const userId = request.user.sub;

		const { address } = await this.getAddressService.execute({
			contactId,
			addressId,
			userId,
		});

		return reply.status(200).send({ address });
	};
}
