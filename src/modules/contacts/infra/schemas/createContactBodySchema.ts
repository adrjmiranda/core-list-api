import { z } from 'zod';

import { CONTACT_ERRORS } from '@/shared/constants/error-codes/contacts.js';

export const createContactBodySchema = z.object({
  name: z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, ' '))
    .refine((val) => val.length >= 3, {
      message: CONTACT_ERRORS.INVALID_NAME,
    }),
  email: z.email(CONTACT_ERRORS.INVALID_EMAIL).trim().optional().nullable(),
  phone: z
    .string()
    .trim()
    .regex(/^\d+$/, CONTACT_ERRORS.INVALID_PHONE)
    .min(12, CONTACT_ERRORS.INVALID_PHONE)
    .max(15, CONTACT_ERRORS.INVALID_PHONE),
});
