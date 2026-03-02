import { FastifyReply, FastifyRequest } from 'fastify';

import { getAddressParamsSchema } from '../../schemas/getAddressParamsSchema.js';
import { updateAddressBodySchema } from '../../schemas/updateAddressBodySchema.js';
import { UpdateAddressService } from '../../services/UpdateAddressService.js';

export class UpdateAddressController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId, addressId } = getAddressParamsSchema.parse(
      request.params,
    );
    const userId = request.user.sub;
    const data = updateAddressBodySchema.parse(request.body);

    const updateAddressService = new UpdateAddressService();

    const { address } = await updateAddressService.execute({
      contactId,
      addressId,
      userId,
      data,
    });

    return reply.status(200).send({ address });
  }
}
