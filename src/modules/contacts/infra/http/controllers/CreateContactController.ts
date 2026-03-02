import type { FastifyReply, FastifyRequest } from 'fastify';

import { createContactBodySchema } from '@/modules/contacts/schemas/createContactBodySchema.js';
import { CreateContactService } from '@/modules/contacts/services/CreateContactService.js';

export class CreateContactController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, phone } = createContactBodySchema.parse(request.body);

    const userId = request.user.sub;

    const createContactService = new CreateContactService();

    const { contact } = await createContactService.execute({
      name,
      email,
      phone,
      userId,
    });

    return reply.status(201).send({ contact });
  }
}
