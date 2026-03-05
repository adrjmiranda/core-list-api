import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

// TODO: Criar regex para validar name
// TODO: Criar regex para validar color
export const createTagBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, ERROR_CODES.INVALID_NAME)
    .transform((val) => val.replace(/\s+/g, ' ').toLowerCase()),
  color: z
    .string()
    .trim()
    .min(1, ERROR_CODES.INVALID_COLOR)
    .transform((value) => value.replace(/\s+/g, ''))
    .transform((value) => value.toUpperCase())
    .optional(),
});
