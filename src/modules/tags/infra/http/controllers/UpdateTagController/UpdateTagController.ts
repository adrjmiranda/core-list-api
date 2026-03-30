import { inject, injectable } from 'tsyringe';

import { updateTagBodySchema } from '#/modules/tags/schemas/body/updateTagBodySchema.js';
import { updateTagParamsSchema } from '#/modules/tags/schemas/params/updateTagParamsSchema.js';
import { UpdateTagService } from '#/modules/tags/services/UpdateTagService/UpdateTagService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class UpdateTagController {
	constructor(
		@inject(UpdateTagService) private updateTagService: UpdateTagService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { tagId } = updateTagParamsSchema.parse(httpRequest.params);
		const userId = String(httpRequest.userId);
		const { name, color } = updateTagBodySchema.parse(httpRequest.body);

		const { tag } = await this.updateTagService.execute({
			tagId,
			userId,
			data: { name, color },
		});

		return {
			statusCode: 200,
			body: { tag },
		};
	};
}
