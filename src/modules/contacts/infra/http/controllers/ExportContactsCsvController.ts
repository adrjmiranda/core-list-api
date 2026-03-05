import { FastifyReply, FastifyRequest } from 'fastify';

import { ExportContactsCsvService } from '@/modules/contacts/services/ExportContactsCsvService.js';

export class ExportContactsCsvController {
  public async handle(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.sub;
    const exportContactsCsvService = new ExportContactsCsvService();

    const csvContent = await exportContactsCsvService.execute({ userId });

    const fileName = `contacts-${new Date().getTime()}.csv`;

    return reply
      .status(200)
      .header('Content-Type', 'text/csv')
      .header('Content-Disposition', `attachment; filename="${fileName}"`)
      .send(csvContent);
  }
}
