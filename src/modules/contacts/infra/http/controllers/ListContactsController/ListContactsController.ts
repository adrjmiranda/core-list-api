import { inject, injectable } from 'tsyringe';

import { listContactsQuerySchema } from '#/modules/contacts/schemas/queries/listContactsQuerySchema.js';
import { ListContactsService } from '#/modules/contacts/services/ListContactsService/ListContactsService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class ListContactsController {
	constructor(
		@inject(ListContactsService)
		private listContactsService: ListContactsService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { page, perPage, search, isFavorite, tagIds } =
			listContactsQuerySchema.parse(httpRequest.query);
		const userId = String(httpRequest.userId);

		const { contacts } = await this.listContactsService.execute({
			userId,
			page,
			perPage,
			search,
			isFavorite,
			tagIds,
		});

		return {
			statusCode: 200,
			body: {
				contacts,
			},
		};
	};
}
