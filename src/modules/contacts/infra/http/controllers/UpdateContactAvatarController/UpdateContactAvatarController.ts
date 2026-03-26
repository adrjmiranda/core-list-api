import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import uploadConfig from '#/config/upload.js';
import { updateContactAvatarParamsSchema } from '#/modules/contacts/schemas/updateContactAvatarParamsSchema.js';
import { UpdateContactAvatarService } from '#/modules/contacts/services/UpdateContactAvatarService/UpdateContactAvatarService.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';

@injectable()
export class UpdateContactAvatarController {
	constructor(
		@inject(UpdateContactAvatarService)
		private updateContactAvatarService: UpdateContactAvatarService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const data = await request.file();

		if (!data) {
			throw new AppError(ERROR_CODES.FILE_REQUIRED, 400);
		}

		const { contactId } = updateContactAvatarParamsSchema.parse(request.params);
		const userId = request.user.sub;

		const fileName = uploadConfig.generateHashName(data.filename);

		const avatar = await this.updateContactAvatarService.execute({
			contactId,
			userId,
			avatarFilename: fileName,
			fileStream: data.file,
		});

		return reply.status(200).send({ avatar });
	};
}
