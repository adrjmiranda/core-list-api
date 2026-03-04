import { FastifyReply, FastifyRequest } from 'fastify';

import { getAddressParamsSchema } from '@/modules/addresses/schemas/getAddressParamsSchema.js';
import { DeleteAddressService } from '@/modules/addresses/services/DeleteAddressService.js';

export class DeleteAddressController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { contactId, addressId } = getAddressParamsSchema.parse(
      request.params,
    );
    const userId = request.user.sub;

    const deleteAddresssService = new DeleteAddressService();

    await deleteAddresssService.execute({
      contactId,
      addressId,
      userId,
    });

    return reply.status(204).send();
  }
}
