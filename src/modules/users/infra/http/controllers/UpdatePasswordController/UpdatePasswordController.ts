import { FastifyReply, FastifyRequest } from 'fastify';

import { updatePasswordBodySchema } from '#/modules/users/schemas/updatePasswordBodySchema.js';
import { UpdatePasswordService } from '#/modules/users/services/UpdatePasswordService/UpdatePasswordService.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdatePasswordController {
  constructor(
    @inject(UpdatePasswordService)
    private updatePasswordService: UpdatePasswordService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.sub;
    const { oldPassword, newPassword } = updatePasswordBodySchema.parse(
      request.body,
    );

    await this.updatePasswordService.execute({
      userId,
      oldPassword,
      newPassword,
    });

    return reply.status(204).send();
  };
}
