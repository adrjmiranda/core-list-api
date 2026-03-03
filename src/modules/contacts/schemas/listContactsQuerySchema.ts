import * as z from 'zod';

import { ERROR_CODES } from '@/shared/constants/errorCodes.js';

export const listContactsQuerySchema = z.object({
  page: z
    .preprocess(
      (value) => (value === '' ? '1' : value),
      z.coerce.number().min(1, ERROR_CODES.INVALID_PAGE),
    )
    .default(1),
  perPage: z
    .preprocess(
      (value) => (value === '' ? '10' : value),
      z.coerce
        .number()
        .min(1, ERROR_CODES.INVALID_PER_PAGE)
        .max(100, ERROR_CODES.INVALID_PER_PAGE),
    )
    .default(10),
  search: z.string(ERROR_CODES.INVALID_SEARCH).trim().optional(),
  isFavorite: z.preprocess(
    (value) =>
      value === 'true' ? true : value === 'false' ? false : undefined,
    z.boolean(ERROR_CODES.INVALID_IS_FAVORITE).optional(),
  ),
  tagIds: z.preprocess(
    (value) => {
      if (!value) return undefined;
      return Array.isArray(value) ? value : [value];
    },
    z.array(z.uuid(ERROR_CODES.INVALID_UUID)).optional(),
  ),
});
