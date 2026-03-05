import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const createTagBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, ERROR_CODES.NAME_REQUIRED)
    .max(50, ERROR_CODES.NAME_LIMIT_EXCEEDED)
    .regex(/^[a-zA-Z0-9À-ÿ\s-]+$/, ERROR_CODES.INVALID_NAME)
    .transform((val) => val.replace(/\s+/g, ' ').toLowerCase()),
  color: z
    .string()
    .trim()
    .min(1, ERROR_CODES.COLOR_REQUIRED)
    .regex(/^#[0-9A-F]{6}$/i, ERROR_CODES.INVALID_COLOR)
    .transform((value) => value.replace(/\s+/g, ''))
    .transform((value) => value.toUpperCase())
    .optional(),
});
