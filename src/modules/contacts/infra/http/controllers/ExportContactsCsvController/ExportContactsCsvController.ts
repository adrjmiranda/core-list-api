import { FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';

import { ExportContactsCsvService } from '#/modules/contacts/services/ExportContactsCsvService/ExportContactsCsvService.js';

@injectable()
export class ExportContactsCsvController {
	constructor(
		@inject(ExportContactsCsvService)
		private exportContactsCsvService: ExportContactsCsvService
	) {}

	public handle = async (request: FastifyRequest, reply: FastifyReply) => {
		const userId = request.user.sub;

		const csvContent = await this.exportContactsCsvService.execute({ userId });

		const fileName = `contacts-${new Date().getTime()}.csv`;

		return reply
			.status(200)
			.header('Content-Type', 'text/csv')
			.header('Content-Disposition', `attachment; filename="${fileName}"`)
			.send(csvContent);
	};
}
