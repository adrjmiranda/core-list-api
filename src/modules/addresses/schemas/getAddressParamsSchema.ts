import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const getAddressParamsSchema = z.object({
  contactId: z.uuid(ERROR_CODES.INVALID_CONTACT_ID),
  addressId: z.uuid(ERROR_CODES.INVALID_ADDRESS_ID),
});
