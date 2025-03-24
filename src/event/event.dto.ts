import { z } from 'zod';

export const createEventSchema = z
  .object({
    name: z.string(),
    date: z.string().date(),
    categoryId: z.string().transform((val) => parseInt(val, 10)),
    creatorId: z.string().transform((val) => parseInt(val, 10)),
  })
  .required();

export const deleteEventSchema = z
  .string()
  .transform((val) => parseInt(val, 10));

export const updateEventSchema = z.object({
  name: z.string().optional(),
  date: z.string().date().optional(),
  categoryId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .optional(),
  id: z.string().transform((val) => parseInt(val, 10)),
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type DeleteEventDto = z.infer<typeof deleteEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
