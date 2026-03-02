import type { FastifyInstance } from 'fastify';

import { addressesRoutes } from '@/modules/addresses/http/routes/addresses.routes.js';
import { contactsRoutes } from '@/modules/contacts/infra/http/routes/contacts.routes.js';
import { usersRoutes } from '@/modules/users/infra/http/routes/users.routes.js';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  await app.register(usersRoutes, { prefix: '/users' });
  await app.register(contactsRoutes, { prefix: '/contacts' });
  await app.register(addressesRoutes, { prefix: '/contacts' });
}
