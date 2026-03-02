import { FastifyReply, FastifyRequest } from 'fastify';

import { getContactParamsSchema } from '@/modules/contacts/infra/schemas/getContactParamsSchema.js';

import { createAddressBodySchema } from '../../schemas/createAddressBodySchema.js';
import { CreateAddressService } from '../../services/CreateAddressService.js';

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
