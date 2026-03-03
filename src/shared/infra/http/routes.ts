import type { FastifyInstance } from 'fastify';

import { addressesRoutes } from '@/modules/addresses/infra/http/routes/addresses.routes.js';
import { contactsRoutes } from '@/modules/contacts/infra/http/routes/contacts.routes.js';
import { tagsRoutes } from '@/modules/tags/infra/http/routes/tags.routes.js';
import { profileRoutes } from '@/modules/users/infra/http/routes/profile.routes.js';
import { usersRoutes } from '@/modules/users/infra/http/routes/users.routes.js';

export async function appRoutes(app: FastifyInstance): Promise<void> {
  await app.register(usersRoutes, { prefix: '/users' });
  await app.register(profileRoutes, { prefix: '/users' });
  await app.register(contactsRoutes, { prefix: '/contacts' });
  await app.register(addressesRoutes, { prefix: '/contacts' });
  await app.register(tagsRoutes, { prefix: '/tags' });
}
