import { inject, injectable } from 'tsyringe';

import { createContactBodySchema } from '#/modules/contacts/schemas/body/createContactBodySchema.js';
import { CreateContactService } from '#/modules/contacts/services/CreateContactService/CreateContactService.js';
import {
	IHttpRequest,
	IHttpResponse,
} from '#/shared/adapters/HttpRouteAdapter.js';

@injectable()
export class CreateContactController {
	constructor(
		@inject(CreateContactService)
		private createContactService: CreateContactService
	) {}

	public handle = async (httpRequest: IHttpRequest): Promise<IHttpResponse> => {
		const { name, email, phone } = createContactBodySchema.parse(
			httpRequest.body
		);

		const userId = String(httpRequest.userId);

		const { contact } = await this.createContactService.execute({
			name,
			email,
			phone,
			userId,
		});

		return {
			statusCode: 201,
			body: {
				contact,
			},
		};
	};
}
