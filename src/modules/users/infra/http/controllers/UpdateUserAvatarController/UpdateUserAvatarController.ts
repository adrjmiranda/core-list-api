import { FastifyReply, FastifyRequest } from 'fastify';

import uploadConfig from '#/config/upload.js';
import { UpdateUserAvatarService } from '#/modules/users/services/UpdateUserAvatarService/UpdateUserAvatarService.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdateUserAvatarController {
  constructor(
    @inject(UpdateUserAvatarService)
    private updateAvatarService: UpdateUserAvatarService,
  ) {}

  public handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const data = await request.file();

    if (!data) {
      throw new AppError(ERROR_CODES.FILE_REQUIRED, 400);
    }

    const userId = request.user.sub;

    const fileName = uploadConfig.generateHashName(data.filename);

    const { avatar } = await this.updateAvatarService.execute({
      userId,
      avatarFilename: fileName,
      fileStream: data.file,
    });

    return reply.status(200).send({ avatar });
  };
}
