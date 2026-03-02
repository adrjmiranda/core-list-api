import { FastifyReply, FastifyRequest } from 'fastify';

import { createAddressBodySchema } from '@/modules/addresses/schemas/createAddressBodySchema.js';
import { CreateAddressService } from '@/modules/addresses/services/CreateAddressService.js';
import { getContactParamsSchema } from '@/modules/contacts/infra/schemas/getContactParamsSchema.js';

export class CreateAddressController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;
    const data = createAddressBodySchema.parse(request.body);

    const createAddressService = new CreateAddressService();

    const { address } = await createAddressService.execute({
      contactId,
      userId,
      data,
    });

    return reply.status(201).send({ address });
  }
}
