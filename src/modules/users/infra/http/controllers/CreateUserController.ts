import type { FastifyReply, FastifyRequest } from 'fastify';

import { createUserBodySchema } from '@/modules/users/schemas/createUserBodySchema.js';
import { CreateUserService } from '@/modules/users/services/CreateUserService.js';

export class CreateUserController {
  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const createUserService = new CreateUserService();
    await createUserService.execute({ name, email, passwordHash: password });

    return reply.status(201).send();
  }
}
