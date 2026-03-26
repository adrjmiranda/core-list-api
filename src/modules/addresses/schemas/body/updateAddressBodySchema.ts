import { createAddressBodySchema } from '#/modules/addresses/schemas/body/createAddressBodySchema.js';

export const updateAddressBodySchema = createAddressBodySchema.partial();
