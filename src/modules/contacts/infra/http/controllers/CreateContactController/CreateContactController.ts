import type { FastifyReply, FastifyRequest } from 'fastify';

import { createContactBodySchema } from '#/modules/contacts/schemas/createContactBodySchema.js';
import { CreateContactService } from '#/modules/contacts/services/CreateContactService/CreateContactService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateContactController {
  constructor(
    @inject(CreateContactService)
    private createContactService: CreateContactService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, phone } = createContactBodySchema.parse(request.body);

    const userId = request.user.sub;

    const { contact } = await this.createContactService.execute({
      name,
      email,
      phone,
      userId,
    });

    return reply.status(201).send({ contact });
  };
}
