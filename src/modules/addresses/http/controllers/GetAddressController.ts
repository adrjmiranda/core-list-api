import { FastifyReply, FastifyRequest } from 'fastify';

import { getAddressParamsSchema } from '../../schemas/getAddressParamsSchema.js';
import { GetAddressService } from '../../services/GetAddressService.js';

export class GetAddressController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId, addressId } = getAddressParamsSchema.parse(
      request.params,
    );
    const userId = request.user.sub;

    const getAddressService = new GetAddressService();

    const { address } = await getAddressService.execute({
      contactId,
      addressId,
      userId,
    });

    return reply.status(200).send({ address });
  }
}
