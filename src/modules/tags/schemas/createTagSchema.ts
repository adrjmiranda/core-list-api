import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

// TODO: Criar regex para validar nome
export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, ERROR_CODES.INVALID_NAME)
    .transform((val) => val.replace(/\s+/g, ' ').toLowerCase()),
});
