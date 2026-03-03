import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const createAddressBodySchema = z.object({
  street: z.string().trim().min(1, ERROR_CODES.INVALID_STREET),
  number: z.string().trim().min(1, ERROR_CODES.INVALID_NUMBER),
  complement: z.string().trim().optional().nullable(),
  neighborhood: z.string().trim().min(1, ERROR_CODES.INVALID_NEIGHBORHOOD),
  city: z.string().trim().min(1, ERROR_CODES.INVALID_CITY),
  state: z
    .string()
    .trim()
    .min(2, ERROR_CODES.INVALID_STATE)
    .max(50, ERROR_CODES.INVALID_STATE)
    .transform((val) => val.toUpperCase()),
  zipCode: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9\s-]+$/, ERROR_CODES.INVALID_ZIP_CODE),
  isDefault: z.boolean().optional().default(false),
});
