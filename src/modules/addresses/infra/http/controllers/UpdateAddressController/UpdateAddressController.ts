import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { updateAddressBodySchema } from '#/modules/addresses/schemas/body/updateAddressBodySchema.js';
import { getAddressParamsSchema } from '#/modules/addresses/schemas/params/getAddressParamsSchema.js';
import { UpdateAddressService } from '#/modules/addresses/services/UpdateAddressService/UpdateAddressService.js';

@injectable()
export class UpdateAddressController {
	constructor(
		@inject(UpdateAddressService)
		private updateAddressService: UpdateAddressService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const { contactId, addressId } = getAddressParamsSchema.parse(
			request.params
		);
		const userId = request.user.sub;
		const data = updateAddressBodySchema.parse(request.body);

		const { address } = await this.updateAddressService.execute({
			contactId,
			addressId,
			userId,
			data,
		});

		return reply.status(200).send({ address });
	};
}
