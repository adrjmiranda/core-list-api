import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const updateContactAvatarParamsSchema = z.object({
  contactId: z.uuid(ERROR_CODES.INVALID_UUID),
});
