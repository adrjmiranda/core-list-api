import { FastifyReply, FastifyRequest } from 'fastify';

import { ListAddressesService } from '@/modules/addresses/services/ListAddressesService.js';
import { getContactParamsSchema } from '@/modules/contacts/schemas/getContactParamsSchema.js';

export class ListAddressesController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const listAddressesService = new ListAddressesService();

    const { addresses } = await listAddressesService.execute({
      contactId,
      userId,
    });

    return reply.status(200).send({ addresses });
  }
}
