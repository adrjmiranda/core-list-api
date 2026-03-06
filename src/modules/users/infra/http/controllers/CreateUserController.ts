import type { FastifyReply, FastifyRequest } from 'fastify';

import { createUserBodySchema } from '@/modules/users/schemas/createUserBodySchema.js';
import { CreateUserService } from '@/modules/users/services/CreateUserService.js';
import { EtherealMailProvider } from '@/shared/container/providers/MailProvider/implementations/EtherealMailProvider.js';

export class CreateUserController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const mailProvider = new EtherealMailProvider();
    const createUserService = new CreateUserService(mailProvider);
    const { user } = await createUserService.execute({
      name,
      email,
      passwordHash: password,
    });

    return reply.status(201).send({ user });
  }
}
