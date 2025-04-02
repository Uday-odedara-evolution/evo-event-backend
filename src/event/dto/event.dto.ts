import { z } from 'zod';

export const getEventsSchema = z.object({
  pageSize: z.string({ message: 'page is required' }),
  pageNumber: z.string({ message: 'pageNumber is required' }),
  creatorId: z.string({ message: 'creatorId is required' }),
  searchQuery: z.string().optional(),
  filters: z.string().optional(),
  sortName: z.string().optional(),
  sortDate: z.string().optional(),
  dFilters: z.string().optional(),
});

export const createEventSchema = z
  .object({
    name: z.string(),
    date: z.string().date(),
    categoryId: z.string().transform((val) => parseInt(val, 10)),
    creatorId: z.string().transform((val) => parseInt(val, 10)),
  })
  .required();

export const deleteEventSchema = z.string().regex(/^\d+$/).transform(Number);

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
export type GetEventDto = z.infer<typeof getEventsSchema>;
