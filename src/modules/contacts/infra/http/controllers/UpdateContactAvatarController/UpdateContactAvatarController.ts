import { inject, injectable } from 'tsyringe';

import uploadConfig from '#/config/upload.js';
import { updateContactAvatarParamsSchema } from '#/modules/contacts/schemas/params/updateContactAvatarParamsSchema.js';
import { UpdateContactAvatarService } from '#/modules/contacts/services/UpdateContactAvatarService/UpdateContactAvatarService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';
import { ERROR_CODES } from '#/shared/constants/errorCodes.js';
import { AppError } from '#/shared/errors/AppError.js';

@injectable()
export class UpdateContactAvatarController {
	constructor(
		@inject(UpdateContactAvatarService)
		private updateContactAvatarService: UpdateContactAvatarService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		if (!httpRequest.file) {
			throw new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
		}

		const data = await httpRequest.file();

		if (!data) {
			throw new AppError(ERROR_CODES.FILE_REQUIRED, 400);
		}

		const { contactId } = updateContactAvatarParamsSchema.parse(
			httpRequest.params
		);
		const userId = String(httpRequest.userId);

		const fileName = uploadConfig.generateHashName(data.filename);

		const avatar = await this.updateContactAvatarService.execute({
			contactId,
			userId,
			avatarFilename: fileName,
			fileStream: data.file,
		});

		return {
			statusCode: 200,
			body: {
				avatar,
			},
		};
	};
}
