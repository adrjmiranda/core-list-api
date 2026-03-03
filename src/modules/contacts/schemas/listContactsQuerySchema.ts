import * as z from 'zod';

export const listContactsQuerySchema = z.object({
  page: z
    .preprocess(
      (value) => (value === '' ? '1' : value),
      z.coerce.number().min(1),
    )
    .default(1),
  perPage: z
    .preprocess(
      (value) => (value === '' ? '10' : value),
      z.coerce.number().min(1).max(100),
    )
    .default(10),
  search: z.string().optional(),
});
