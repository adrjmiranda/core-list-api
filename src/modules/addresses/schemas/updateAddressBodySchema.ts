import { createAddressBodySchema } from '@/modules/addresses/schemas/createAddressBodySchema.js';

export const updateAddressBodySchema = createAddressBodySchema.partial();
