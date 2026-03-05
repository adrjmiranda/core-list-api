import { createTagBodySchema } from '@/modules/tags/schemas/createTagBodySchema.js';

export const updateTagBodySchema = createTagBodySchema.partial();
