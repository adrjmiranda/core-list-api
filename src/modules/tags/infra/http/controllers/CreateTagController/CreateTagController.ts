import { inject, injectable } from 'tsyringe';

import { createTagBodySchema } from '#/modules/tags/schemas/body/createTagBodySchema.js';
import { CreateTagService } from '#/modules/tags/services/CreateTagService/CreateTagService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class CreateTagController {
	constructor(
		@inject(CreateTagService) private createTagService: CreateTagService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { name, color } = createTagBodySchema.parse(httpRequest.body);
		const userId = String(httpRequest.userId);

		const { tag } = await this.createTagService.execute({
			data: { name, color },
			userId,
		});

		return {
			statusCode: 201,
			body: { tag },
		};
	};
}
