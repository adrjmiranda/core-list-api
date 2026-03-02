import { FastifyReply, FastifyRequest } from 'fastify';

import { getAddressParamsSchema } from '@/modules/addresses/schemas/getAddressParamsSchema.js';
import { updateAddressBodySchema } from '@/modules/addresses/schemas/updateAddressBodySchema.js';
import { UpdateAddressService } from '@/modules/addresses/services/UpdateAddressService.js';

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
