import type { FastifyReply, FastifyRequest } from 'fastify';

import { createUserBodySchema } from '#/modules/users/schemas/createUserBodySchema.js';
import { CreateUserService } from '#/modules/users/services/CreateUserService/CreateUserService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateUserController {
  constructor(
    @inject(CreateUserService) private createUserService: CreateUserService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password } = createUserBodySchema.parse(request.body);

    const { user } = await this.createUserService.execute({
      name,
      email,
      passwordHash: password,
    });

    return reply.status(201).send({ user });
  };
}
