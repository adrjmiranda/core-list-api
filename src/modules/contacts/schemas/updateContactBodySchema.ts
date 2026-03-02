import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const updateContactBodySchema = z.object({
  name: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .refine((val) => val.length >= 3, ERROR_CODES.INVALID_NAME)
    .optional(),

  email: z.email(ERROR_CODES.INVALID_EMAIL).trim().optional().nullable(),

  phone: z
    .string()
    .trim()
    .regex(/^\d+$/, ERROR_CODES.INVALID_PHONE)
    .min(12, ERROR_CODES.INVALID_PHONE)
    .max(15, ERROR_CODES.INVALID_PHONE)
    .optional(),
});
