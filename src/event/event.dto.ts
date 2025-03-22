import { z } from 'zod';

export const createEventSchema = z
  .object({
    name: z.string(),
  })
  .required();

export type CreateEventDto = z.infer<typeof createEventSchema>;
