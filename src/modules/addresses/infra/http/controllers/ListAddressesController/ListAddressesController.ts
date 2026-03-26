import { FastifyReply, FastifyRequest } from 'fastify';

import { ListAddressesService } from '#/modules/addresses/services/ListAddressesService/ListAddressesService.js';
import { getContactParamsSchema } from '#/modules/contacts/schemas/getContactParamsSchema.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListAddressesController {
  constructor(
    @inject(ListAddressesService)
    private listAddressesService: ListAddressesService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const { addresses } = await this.listAddressesService.execute({
      contactId,
      userId,
    });

    return reply.status(200).send({ addresses });
  };
}
