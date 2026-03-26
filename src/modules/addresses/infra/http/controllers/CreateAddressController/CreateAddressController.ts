import { FastifyReply, FastifyRequest } from 'fastify';

import { createAddressBodySchema } from '#/modules/addresses/schemas/createAddressBodySchema.js';
import { CreateAddressService } from '#/modules/addresses/services/CreateAddressService/CreateAddressService.js';
import { getContactParamsSchema } from '#/modules/contacts/schemas/getContactParamsSchema.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateAddressController {
  constructor(
    @inject(CreateAddressService)
    private createAddressService: CreateAddressService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { contactId } = getContactParamsSchema.parse(request.params);
    const userId = request.user.sub;
    const data = createAddressBodySchema.parse(request.body);

    const { address } = await this.createAddressService.execute({
      contactId,
      userId,
      data,
    });

    return reply.status(201).send({ address });
  };
}
